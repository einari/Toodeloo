using System;
using System.Linq;
using System.Reflection;

namespace Toodeloo.WinRT.Execution.Activation
{
	public class ComplexStrategy : IStrategy
	{
		readonly IContainer _container;

		public ComplexStrategy(IContainer container)
		{
			_container = container;
		}

		public bool CanActivate(Type type)
		{
            var typeInfo = type.GetTypeInfo();
			if (!typeInfo.IsValueType|| HasDefaultConstructor(type) )
				return false;

			var constructors = typeInfo.DeclaredConstructors.ToArray();
			if (constructors.Length != 1)
				return false;

			var constructor = constructors[0];
			var parameters = constructor.GetParameters();
			if (parameters.Where(p => p.ParameterType.GetTypeInfo().IsValueType).Count() > 0)
				return false;

			return true;
		}

		public object GetInstance(Type type)
		{
			var constructor = type.GetTypeInfo().DeclaredConstructors.First();
			var parameters = constructor.GetParameters();
			var parameterValues = parameters.Select(parameter => _container.Get(parameter.ParameterType)).ToList();
			var instance = constructor.Invoke(parameterValues.ToArray());
			return instance;
		}

		static bool HasDefaultConstructor(Type type)
		{
            return type.GetTypeInfo().DeclaredConstructors.Any(c => c.GetParameters().Length == 0);
		}
	}
}
