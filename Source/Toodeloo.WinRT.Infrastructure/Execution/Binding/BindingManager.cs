using System;
using System.Linq;
using System.Collections.Generic;
using System.Reflection;

namespace Toodeloo.WinRT.Execution.Binding
{
	public class BindingManager : IBindingManager
	{
		readonly Dictionary<Type, IBinding> _bindings = new Dictionary<Type, IBinding>();


		public bool HasBinding(Type type)
		{
			return _bindings.ContainsKey(type);
		}

		public IBinding GetBinding(Type type)
		{
			return _bindings[type];
		}

		public void Register(IBinding binding)
		{
			if( binding.Scope == null && binding.Target != null )
			{
				var attributes = binding.Target.GetTypeInfo().GetCustomAttributes(typeof (SingletonAttribute), true);
				if (attributes.Count() == 1)
					binding.Scope = In.SingletonScope();
			}

			_bindings[binding.Service] = binding;
		}
	}
}