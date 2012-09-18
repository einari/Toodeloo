﻿using GalaSoft.MvvmLight.Messaging;
using Toodeloo.WinRT.Messages;
using Windows.ApplicationModel.DataTransfer;

namespace Toodeloo.WinRT.Services
{
    public class SharingService : ISharingService
    {
        ToDoItem _selectedItem;

        public SharingService(IMessenger messenger)
        {
            messenger.Register<ItemSelected>(this, message => _selectedItem = message.Item);
        }

        public void Initialize()
        {
            var dataTransferManager = DataTransferManager.GetForCurrentView();
            dataTransferManager.DataRequested += ShareRequested;
        }

        void ShareRequested(DataTransferManager sender, DataRequestedEventArgs args)
        {
            if( _selectedItem != null ) 
            {
                args.Request.Data.Properties.Title = "Toodeloo";
                args.Request.Data.Properties.Description = "A ToDo item from Toodeloo";
                args.Request.Data.SetText(_selectedItem.Title);
            }
        }
    }
}
