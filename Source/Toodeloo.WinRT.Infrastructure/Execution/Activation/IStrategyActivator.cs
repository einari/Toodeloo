using System;

namespace Toodeloo.WinRT.Infrastructure.Execution.Activation
{
	public interface IStrategyActivator
	{
		IStrategy GetInstance(Type type);
	}
}