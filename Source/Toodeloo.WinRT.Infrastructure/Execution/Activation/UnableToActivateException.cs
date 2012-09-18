using System;

namespace Toodeloo.WinRT.Execution.Activation
{
	public class UnableToActivateException : ArgumentException
	{
		public UnableToActivateException(Type service)
			: base("No activation strategy was able to activate '" + service.Name + "'")
		{
			
		}
	}
}