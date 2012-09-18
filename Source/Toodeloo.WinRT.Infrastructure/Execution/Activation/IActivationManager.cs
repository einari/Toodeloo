using System;

namespace Toodeloo.WinRT.Execution.Activation
{
	public interface IActivationManager
	{
		IStrategy GetStrategyFor(Type type);
	}
}