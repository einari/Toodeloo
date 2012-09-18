using System;
using System.Collections.Generic;
using System.Linq;
using Toodeloo.WinRT.Execution.Activation;

namespace Toodeloo.WinRT.Execution.Binding
{
	public class BindingDiscoverer : IBindingDiscoverer
	{
		readonly List<IBindingConvention> _conventions = new List<IBindingConvention>();
		readonly IActivationManager _activationManager;

		public BindingDiscoverer(IActivationManager activationManager, ITypeDiscoverer typeDiscoverer)
		{
			var conventionTypes = typeDiscoverer.FindMultiple<IBindingConvention>();
			foreach( var conventionType in conventionTypes )
				_conventions.Add((IBindingConvention)Activator.CreateInstance(conventionType));

			_activationManager = activationManager;
		}

		public void AddConvention(IBindingConvention convention)
		{
			_conventions.Add(convention);
		}

		public IBinding Discover(Type type)
		{
			var convention = _conventions.Where(c => c.CanBeBound(type)).FirstOrDefault();
			if( convention != null )
			{
				var target = convention.GetBindingTarget(type);
				var activationStrategy = _activationManager.GetStrategyFor(target);
				var binding = new StandardBinding(type, target, activationStrategy);
				return binding;
			}
			return null;
		}
	}
}