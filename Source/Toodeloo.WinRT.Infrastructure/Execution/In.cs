using Toodeloo.WinRT.Infrastructure.Execution.Activation;

namespace Toodeloo.WinRT.Infrastructure.Execution
{
	public class In
	{
		public static IScope SingletonScope()
		{
			return new SingletonScope();
		}
	}
}