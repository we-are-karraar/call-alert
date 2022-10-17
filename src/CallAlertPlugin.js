import React from 'react';
import { FlexPlugin } from '@twilio/flex-plugin';

import CustomTaskList from './components/CustomTaskList/CustomTaskList';

const PLUGIN_NAME = 'CallAlertPlugin';

export default class CallAlertPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   */
  async init(flex, manager) {
    const options = { sortOrder: -1 };
    flex.AgentDesktopView.Panel1.Content.add(<CustomTaskList key="CallAlertPlugin-component" />, options);
    
    let alertSound = new Audio("https://cardinal-walrus-5260.twil.io/assets/7120-download-iphone-6-original-ringtone-42676.mp3");
    alertSound.loop = true;

    const resStatus = ["accepted","canceled","rejected","rescinded","timeout"];
    console.log("XXXXX");
    manager.workerClient.on("reservationCreated", function(reservation) {
      console.log('reservation created ', reservation.task)

      if (
        reservation.task.taskChannelUniqueName === "voice" &&
        reservation.task.attributes.direction === "inbound"
      ) {
        console.log("YYYYY");
        alertSound.play();
      }
      resStatus.forEach((e) => {
        reservation.on(e, () => {
          alertSound.pause()
        });
      });
});

  
  
  }
}