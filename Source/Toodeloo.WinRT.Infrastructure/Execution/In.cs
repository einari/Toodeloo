using Toodeloo.WinRT.Execution.Activation;

namespace Toodeloo.WinRT.Execution
{
	public class In
	{
		public static IScope SingletonScope()
		{
			return new SingletonScope();
		}
	}
}