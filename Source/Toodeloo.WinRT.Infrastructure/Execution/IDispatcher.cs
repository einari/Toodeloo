using System;

namespace Toodeloo.WinRT.Infrastructure.Execution
{
	public interface IDispatcher
	{
		bool CheckAccess();
		void BeginInvoke(Action a);
	}
}
