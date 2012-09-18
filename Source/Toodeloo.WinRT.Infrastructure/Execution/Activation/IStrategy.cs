using System;

namespace Toodeloo.WinRT.Execution.Activation
{
	public interface IStrategy
	{
		bool CanActivate(Type type);
		object GetInstance(Type type);
	}
}