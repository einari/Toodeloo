using System;

namespace Toodeloo.WinRT.Execution.Binding
{
	public interface IBindingConvention
	{
		bool CanBeBound(Type type);
		Type GetBindingTarget(Type type);
	}
}