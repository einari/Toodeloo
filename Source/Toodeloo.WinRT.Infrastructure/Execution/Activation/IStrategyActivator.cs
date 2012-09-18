using System;

namespace Toodeloo.WinRT.Execution.Activation
{
	public interface IStrategyActivator
	{
		IStrategy GetInstance(Type type);
	}
}