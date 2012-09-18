using System;

namespace Toodeloo.WinRT.Execution.Activation
{
	public interface IScope
	{
		bool IsInScope(Type type);
		object GetInstance(Type type);
		void SetInstance(Type type, object instance);
	}
}
