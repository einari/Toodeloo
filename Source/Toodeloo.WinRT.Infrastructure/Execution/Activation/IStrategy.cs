using System;

namespace Toodeloo.WinRT.Infrastructure.Execution.Activation
{
	public interface IStrategy
	{
		bool CanActivate(Type type);
		object GetInstance(Type type);
	}
}