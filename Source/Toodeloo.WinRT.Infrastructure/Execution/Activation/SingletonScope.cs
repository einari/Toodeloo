using System;
using System.Collections.Generic;

namespace Toodeloo.WinRT.Infrastructure.Execution.Activation
{
	public class SingletonScope : IScope
	{
		readonly Dictionary<Type, object> _instances = new Dictionary<Type, object>();

		public bool IsInScope(Type type)
		{
			return _instances.ContainsKey(type);
		}

		public object GetInstance(Type type)
		{
			return _instances[type];
		}

		public void SetInstance(Type type, object instance)
		{
			_instances[type] = instance;
		}
	}
}