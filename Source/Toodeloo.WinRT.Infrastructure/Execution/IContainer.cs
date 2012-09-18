using System;
using Toodeloo.WinRT.Infrastructure.Execution.Activation;

namespace Toodeloo.WinRT.Infrastructure.Execution
{
	public interface IContainer
	{
		T Get<T>();
		object Get(Type service);
		void Register<TS, TT>(IScope scope=null) where TT : TS;
		void Register(Type service, Type target, IScope scope = null);
		void Register<TS>(TS instance, IScope scope = null);
		void Register(Type service, object instance, IScope scope=null);
	}
}
