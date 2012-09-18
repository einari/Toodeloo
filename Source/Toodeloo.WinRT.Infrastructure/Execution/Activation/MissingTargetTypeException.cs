using System;

namespace Toodeloo.WinRT.Execution.Activation
{
    public class MissingTargetTypeException : ArgumentException
    {
        public MissingTargetTypeException(Type service)
        {
            Service = service;
        }

        public Type Service { get; private set; }

    }
}
