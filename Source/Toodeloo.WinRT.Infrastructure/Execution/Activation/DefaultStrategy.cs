using System;
using System.Linq;
using System.Reflection;

namespace Toodeloo.WinRT.Infrastructure.Execution.Activation
{
	public class DefaultStrategy : IStrategy
	{
		public bool CanActivate(Type type)
		{
            var typeInfo = type.GetTypeInfo();
			if (typeInfo.IsValueType)
				return true;

            var constructor = typeInfo.DeclaredConstructors.FirstOrDefault(c => c.GetParameters().Length == 0);
			return constructor != null;
		}

		public object GetInstance(Type type)
		{
			return Activator.CreateInstance(type);
		}
	}
}