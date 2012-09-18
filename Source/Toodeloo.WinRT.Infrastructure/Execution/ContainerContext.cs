using Toodeloo.WinRT.Execution.Activation;
using Toodeloo.WinRT.Execution.Binding;

namespace Toodeloo.WinRT.Execution
{
	public class ContainerContext
	{
		static readonly object LockObject = new object();
		static Container _current;

		public static IContainer Current
		{
			get
			{
				lock( LockObject )
				{
					if( _current == null )
						
						InitializeDefault();

					return _current;
				}
			}
		}

		static void InitializeDefault()
		{
			_current = new Container();

			var assemblyLocator = new AssemblyLocator();
			var typeDiscoverer = new TypeDiscoverer(assemblyLocator);

			var bindingManager = new BindingManager();
			var strategyActivator = new StrategyActivator(_current);
			var activationManager = new ActivationManager(typeDiscoverer, strategyActivator);
			var bindingDiscoverer = new BindingDiscoverer(activationManager, typeDiscoverer);

			_current.Initialize(bindingManager, bindingDiscoverer, activationManager);
		}
	}
}