import { Component } from '@angular/core';

import { Step2 } from './step2/step2';
import { Step3 } from './step3/step3';
import { Step4 } from './step4/step4';
import { Step5 } from "./step5/step5";
import { Step6 } from "./step6/step6";
import { Step7 } from "./step7/step7";
import { Step8 } from "./step8/step8";
import { Step9 } from "./step9/step9";
import { Step10 } from "./step10/step10";
import { Step11 } from "./step11/step11";
import { Step12 } from "./step12/step12";
import { Step13 } from "./step13/step13";
import { Step14 } from "./step14/step14";
import { Step15 } from "./step15/step15";

@Component({
  selector: 'app-signal-processing',
  imports: [

    Step2,
    Step3,
    Step4,
    Step5,
    Step6,
    Step7,
    Step8,
    Step9,
    Step10,
    Step11,
    Step12,
    Step13,
    Step14,
    Step15
  ],
  templateUrl: './signal-processing.component.html',
  styleUrl: './signal-processing.component.scss'
})
export class SignalProcessingComponent {

}
