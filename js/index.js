// import 'd3'
// import {Observable} from 'rxjs'
// import {frame$} from './utils.js'

import { FutureOf } from './future-of.js'
import { CoreValues } from './core-values.js'
import { OurUniversity } from './our-university.js'

window.addEventListener('DOMContentLoaded', init)

function init() {        
  new FutureOf()  
  new CoreValues()
  new OurUniversity()
}



