using System;
using Windows.UI.Core;

namespace Toodeloo.WinRT.Infrastructure.Execution
{
	public class Dispatcher : IDispatcher
	{
		private readonly CoreDispatcher _systemDispatcher;

		public Dispatcher(CoreDispatcher systemDispatcher)
		{
			_systemDispatcher = systemDispatcher;
		}

		public bool CheckAccess()
		{
            return _systemDispatcher.HasThreadAccess;
		}

		public void BeginInvoke(Action action)
		{
			_systemDispatcher.RunAsync(CoreDispatcherPriority.Normal,() => action());
		}
	}
}
