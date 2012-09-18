using System;
using System.Reflection;

namespace Toodeloo.WinRT.Infrastructure.Execution.Binding
{
	public class SelfBindingConvention : IBindingConvention
	{
		public bool CanBeBound(Type type)
		{
            return !type.GetTypeInfo().IsInterface;
		}

		public Type GetBindingTarget(Type type)
		{
			return type;
		}
	}
}