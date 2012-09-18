using System;
using System.Reflection;

namespace Toodeloo.WinRT.Infrastructure.Execution.Binding
{
	public class DefaultBindingConvention : IBindingConvention
	{
		public bool CanBeBound(Type type)
		{
			if(type.Name.StartsWith("I") && type.GetTypeInfo().IsInterface)
			{
				var targetType = GetTargetType(type);
				return targetType != null;
			}
			return false;
		}

		static Type GetTargetType(Type type)
		{
			var typeName = string.Format("{0}.{1}", type.Namespace, type.Name.Substring(1));
			return type.GetTypeInfo().Assembly.GetType(typeName);
		}

		public Type GetBindingTarget(Type type)
		{
			return GetTargetType(type);
		}
	}
}