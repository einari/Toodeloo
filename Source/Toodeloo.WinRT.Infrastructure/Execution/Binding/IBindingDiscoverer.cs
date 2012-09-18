﻿using System;

namespace Toodeloo.WinRT.Infrastructure.Execution.Binding
{
	public interface IBindingDiscoverer
	{
		void AddConvention(IBindingConvention convention);
		IBinding Discover(Type type);
	}
}