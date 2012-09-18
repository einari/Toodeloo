using System;
using System.Linq;
using System.Reflection;

namespace Toodeloo.WinRT.Infrastructure.Execution.Activation
{
	public class StrategyActivator : IStrategyActivator
	{
		readonly IContainer _container;

		public StrategyActivator(IContainer container)
		{
			_container = container;
		}

		public IStrategy GetInstance(Type type)
		{
            var typeInfo = type.GetTypeInfo();
            var defaultConstructor = typeInfo.DeclaredConstructors.Where(c => c.GetParameters().Length == 0).FirstOrDefault();
			if (defaultConstructor != null)
				return Activator.CreateInstance(type) as IStrategy;

            var containerConstructor = typeInfo.DeclaredConstructors.Where(c => c.GetParameters().Any(p=>p.ParameterType == typeof(IContainer))).FirstOrDefault();
			if (containerConstructor != null)
				return Activator.CreateInstance(type, _container) as IStrategy;

			//throw new ActivationStrategyConstructorMissing(type);
            return null;
		}
	}
}