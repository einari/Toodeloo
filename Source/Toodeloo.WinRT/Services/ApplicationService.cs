using GalaSoft.MvvmLight.Messaging;
using System.Collections.Generic;
using Toodeloo.WinRT.Messages;

namespace Toodeloo.WinRT.Services
{
    public class ApplicationService : IApplicationService
    {
        IMessenger _messenger;

        public ApplicationService(IMessenger messenger)
        {
            _messenger = messenger;
        }

        public void Suspend()
        {
            _messenger.Send(new Suspend());
        }

        public void Activate()
        {
            _messenger.Send(new Activate());
        }

        public void Resume()
        {
            _messenger.Send(new Resume());
        }
    }
}
