using System;

namespace Toodeloo.WinRT.Infrastructure.Execution.Binding
{
	public interface IBindingConvention
	{
		bool CanBeBound(Type type);
		Type GetBindingTarget(Type type);
	}
}