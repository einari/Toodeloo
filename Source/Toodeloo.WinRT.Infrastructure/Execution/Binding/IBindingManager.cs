using System;

namespace Toodeloo.WinRT.Execution.Binding
{
	public interface IBindingManager
	{
		bool HasBinding(Type type);
		IBinding GetBinding(Type type);
		void Register(IBinding binding);
	}
}