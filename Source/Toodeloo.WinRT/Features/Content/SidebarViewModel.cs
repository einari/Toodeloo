﻿using GalaSoft.MvvmLight.Messaging;
using System.Windows.Input;
using Toodeloo.WinRT.Infrastructure.Input;
using Toodeloo.WinRT.Messages;
using Toodeloo.WinRT.Services;

namespace Toodeloo.WinRT.Features.Content
{
    public class SidebarViewModel
    {
        IToDoService _toDoService;
        IMessenger _messenger;

        public SidebarViewModel(IToDoService toDoService, IMessenger messenger)
        {
            _toDoService = toDoService;
            _messenger = messenger;

            AddCommand = DelegateCommand.Create(Add);
        }

        public ICommand AddCommand { get; private set; }
        public string Title { get; set; }

        void Add()
        {
            if (!string.IsNullOrEmpty(Title))
            {
                _toDoService.AddItem(Title);
                _messenger.Send(new ItemAdded { Title = this.Title });
            }
        }
    }
}
