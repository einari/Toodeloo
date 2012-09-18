using System;
using Toodeloo.WinRT.Infrastructure.Execution.Activation;
using Toodeloo.WinRT.Infrastructure.Execution.Binding;

namespace Toodeloo.WinRT.Infrastructure.Execution
{
	public class Container : IContainer
	{
		IBindingManager _bindingManager;
		IBindingDiscoverer _bindingDiscoverer;
		IActivationManager _activationManager;

		public Container(IBindingManager bindingManager, IBindingDiscoverer bindingDiscoverer, IActivationManager activationManager)
		{
			_bindingManager = bindingManager;
			_bindingDiscoverer = bindingDiscoverer;
			_activationManager = activationManager;
		}

		internal Container() {}
		internal void Initialize(IBindingManager bindingManager, IBindingDiscoverer bindingDiscoverer, IActivationManager activationManager)
		{
			_bindingManager = bindingManager;
			_bindingDiscoverer = bindingDiscoverer;
			_activationManager = activationManager;
			Register<IContainer>(this);
		}

		public T Get<T>()
		{
			var service = typeof(T);
			var instance = Get(service);
			return (T) instance;
		}

		public object Get(Type service)
		{
			IBinding binding = null;
			if( _bindingManager.HasBinding(service) )
				binding = _bindingManager.GetBinding(service);

			if (binding == null)
			{
				binding = _bindingDiscoverer.Discover(service);

				if (binding != null)
					_bindingManager.Register(binding);
			}

			return binding != null ? Activate(binding) : null;
		}

		public void Register<TS, TT>(IScope scope = null) where TT : TS
		{
			Register(typeof (TS), typeof (TT));
		}

		public void Register(Type service, Type target, IScope scope = null)
		{
            ThrowIfTargetIsMissing(service, target);

			var strategy = _activationManager.GetStrategyFor(target);
			var binding = new StandardBinding(service, target, strategy) {Scope = scope};
			_bindingManager.Register(binding);
		}

		public void Register<TS>(TS instance, IScope scope = null)
		{
			Register(typeof(TS), instance);
		}

		public void Register(Type service, object instance, IScope scope = null)
		{
			var strategy = new ConstantStrategy(instance);
			var binding = new StandardBinding(service, null, strategy) {Scope = scope};
			_bindingManager.Register(binding);
		}

		static object Activate(IBinding binding)
		{
			if( binding.Scope != null && binding.Scope.IsInScope(binding.Target) )
				return binding.Scope.GetInstance(binding.Target);

			var instance = binding.Strategy.GetInstance(binding.Target);
			if (binding.Scope != null)
				binding.Scope.SetInstance(binding.Target, instance);

			return instance;
		}


        void ThrowIfTargetIsMissing(Type service, Type target)
        {
            if (target == null)
                throw new MissingTargetTypeException(service);
        }
	}
}