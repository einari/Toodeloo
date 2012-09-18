using System;

namespace Toodeloo.WinRT.Infrastructure.Execution.Activation
{
	public interface IActivationManager
	{
		IStrategy GetStrategyFor(Type type);
	}
}