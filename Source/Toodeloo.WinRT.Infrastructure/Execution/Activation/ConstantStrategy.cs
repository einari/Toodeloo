using System;

namespace Toodeloo.WinRT.Infrastructure.Execution.Activation
{
	public class ConstantStrategy : IStrategy
	{
		object _instance;

		public ConstantStrategy(object instance)
		{
			_instance = instance;
		}

		public bool CanActivate(Type type)
		{
			return false;
		}

		public object GetInstance(Type type)
		{
			return _instance;
		}
	}
}
