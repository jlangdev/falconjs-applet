/* eslint-disable */ 
<template>
  <v-container>
    <v-snackbar v-model="snackbar">
      {{snack}}

      <template v-slot:actions>
        <v-btn color="green" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img :src="require('../assets/cs.png')" class="my-3" contain height="200" />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to FalconJS
        </h1>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-5">
          Authentication
        </h2>
        <v-row justify="center">

          <v-text-field v-model="clientID" label="Client ID"></v-text-field>
        </v-row>

        <v-row justify="center">

          <v-text-field v-model="clientSecret" label="Client Secret"></v-text-field>
        </v-row>

        <v-row justify="center">

          <v-text-field v-model="baseUrl" label="Base URL"></v-text-field>
        </v-row>
        <v-row justify="center">

          <v-btn @click="build()" elevation="12" size="x-large" color="teal-accent-4">Authenticate!!!</v-btn>
        </v-row>
        <v-row justify="center">
          <v-card title="Your Token:" width="400" height="200" class="overflow-auto my-10 pa-5">
            {{ token }}</v-card>
        </v-row>
        <v-divider></v-divider>

      </v-col>
      


      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-5">
          {{ hostMsg }}
        </h2>
        <v-row justify="center">

          <v-btn @click="queryHosts()" elevation="12" size="x-large" color="teal-accent-4">Query Hosts</v-btn>
        </v-row>
        <v-row justify="center">
          <v-card title="Host IDs:" class="mx-auto pa-2  my-10" max-width="600">
            <v-list>
              <v-list-item v-for="id, index in this.devices" :key="index" :value="id" color="primary" rounded="xl"
                @click="hostDetails(id)">{{ id }}</v-list-item>
            </v-list>
          </v-card>
        </v-row>
        <v-row justify="center">
          <v-dialog v-model="dialog" width="800">
            <v-card width="800" height="1200" class="overflow-auto my-10">

              <vue-json-pretty :data="details" />
            </v-card>
          </v-dialog>
        </v-row>
      </v-col>
      <v-divider></v-divider>




      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-5">
          {{ detectsMsg }}
        </h2>
        <v-row justify="center">

          <v-btn v-if="!detectsClicked0" @click="queryDetects()" elevation="12" size="x-large" color="teal-accent-4">Query Detections</v-btn>
          <v-btn v-if="detectsClicked0" @click="detectDetails()" elevation="12" size="x-large" color="teal-accent-4">get deets</v-btn>

        </v-row>
        <v-row justify="center">
          <v-card v-if="!detectsClicked" title="Detection IDs:" height="400" class="overflow-auto  mx-auto pa-2  my-10" max-width="600">
            <v-list>
              <v-list-item v-for="id, index in this.detects" :key="index" :value="id" color="primary"
                rounded="xl">{{ id }}</v-list-item>
            </v-list>
          </v-card>
          <v-sheet elevation="2">
          <v-table height="400" class="overflow-auto flex-1-1-100 ma-2 pa-2" v-if="detectsClicked">
            <thead>
              <tr>
                <th class="text-left">
                  Time
                </th>
                <th class="text-left">
                  ID
                </th>
                <th class="text-left">
                  Device
                </th>
                <th class="text-left">
                  Threat
                </th>
                <th class="text-left">
                  Confidence
                </th>
                <th class="text-left">
                  Status
                </th>
                <th class="text-left">

                </th>

              </tr>
            </thead>
            <tbody>
              <tr v-for="item in detDetails" :key="item.detection_id">
                <td>{{ item.created_timestamp }}</td>
                <td>{{ item.detection_id }}</td>
                <td>{{ item.device.hostname }}</td>
                <td>{{ item.behaviors[0].display_name }}</td>
                <td>{{ item.max_confidence }}</td>
                <td>{{ item.status }}</td>
                <td> <v-btn @click="inspectDetect(item)">Inspect</v-btn>
                </td>


              </tr>
            </tbody>
          </v-table>
        </v-sheet>
          <v-dialog v-model="detectDialog" width="800">
            <v-card width="800" height="600" class="my-10">
              <v-card-title>
                {{detectDoots.detection_id}}
              </v-card-title>
              <v-sheet :height="500" :width="600" class="overflow-auto pa-10">
                <vue-json-pretty :data="detectDoots" />

              </v-sheet>
              <v-divider></v-divider>

              <v-card-actions>
                <v-btn variant="elevated" color="teal-accent-4" @click="reveal = true">
                  Modify Detection
                </v-btn>
                <v-btn variant="tonal" color="teal-accent-5" @click="detectDialog = false">
                  Close
                </v-btn>
              </v-card-actions>
              <v-expand-transition>
                <v-card v-if="reveal" class="v-card--reveal" style="height: 100%;">
                  <v-card-text class="pb-0">
                    <p class="text-h4 text--primary">
                      Modify Detection
                    </p>
                    <p class="text--primary">
                      Use this form to update this detection's status. Select a new status, then click submit.
                    </p>
                    <p>Current Status: <strong>{{detectDoots.status}}</strong></p>
                    <v-radio-group v-model="newStatus">
                      <v-radio label="New" value="new"></v-radio>
                      <v-radio label="In Progress" value="in_progress"></v-radio>
                      <v-radio label="Reopened" value="reopened"></v-radio>
                      <v-radio label="Closed" value="closed"></v-radio>
                    </v-radio-group>
                  </v-card-text>
                  <v-card-actions class="pt-0">

                    <v-btn variant="elevated" color="teal-accent-4" @click="updateDetect(detectDoots.detection_id, newStatus)">
                      Submit
                    </v-btn>
                    <v-btn variant="tonal" color="teal-accent-5" @click="reveal = false">
                      Back
                    </v-btn>
                  </v-card-actions>

                </v-card>
              </v-expand-transition>
            </v-card>
          </v-dialog>
        </v-row>
      </v-col>
      <v-divider></v-divider>


      <v-col class="mb-5" cols="12">
      <h2 class="headline font-weight-bold mb-5">
        {{ dashMsg }}
      </h2>
      <v-sheet elevation="2">
      <v-row justify="center">
        <v-col class="mb-1" cols="9">
          <v-row justify="center">

        <v-card title="Hosts online" class="mx-auto pa-2  my-2" max-width="600">
          <h1 class="headline font-weight-bold mb-5">

          {{ devices.length }}
        </h1>

        </v-card>
        <v-card title="New Detections" class="mx-auto pa-2  my-2" max-width="600">
          <h1 class="headline font-weight-bold mb-5">

          {{ detects.length }}
        </h1>
        </v-card>
        </v-row>
        <v-row>
          
          <v-table class="flex-1-1-100 ma-2 pa-2">
            <thead>
              <tr>
                <th class="text-left">
                  Host
                </th>
                <th class="text-left">
                  ZTA Score
                </th>
                <th class="text-left">
                </th>
        

              </tr>
            </thead>
            <tbody>
              <tr v-for="item, i in this.ztaDetails" :key="i" :value="item">
                <td>{{ item.aid }}</td>
                <td>{{ item.score }}</td>
                <td> <v-btn @click="containHost(item.aid)">Contain</v-btn> </td>


              </tr>
            </tbody>
          </v-table>
        </v-row>
      </v-col>

        <v-col class="mb-1" cols="3">

        <v-list v-if="this.ztaScores[0]">
          <v-list-item v-for="platforms, i in this.ztaScores[0]['platforms']" :key="i" :value="platforms">
          <v-card  :title="platforms.name" class="mx-auto pa-2  my-10" max-width="600">
            <p>
              Avg Overall ZTA: 
            </p>
              <h1 class="headline font-weight-bold mb-5">
                {{ platforms.average_overall_score.toString().slice(0,2) }}
              </h1>

          </v-card>
        </v-list-item></v-list>
      </v-col>
        
       
      </v-row>
    </v-sheet>
    </v-col>
      <v-divider></v-divider>



    </v-row>
  </v-container>
</template>

<script>
import { Falcon } from 'crowdstrike-falcon'
import VueJsonPretty from 'vue-json-pretty';

import 'vue-json-pretty/lib/styles.css';


export default {
  name: 'HelloWorld',
  components: {
    VueJsonPretty,
  },
  data: () => ({
    token: "",
    clientID: "...",
    clientSecret: "...",
    baseUrl: "https://api.crowdstrike.com",
    falcon: {},
    devices: [],
    details: "Click a Host ID to retrieve details",
    dialog: false,
    hostMsg: "We need data",
    detects: [],
    detDetails: [],
    detectsMsg: "Let's see some detections",
    detectsClicked: false,
    detectsClicked0: false,
    detectDialog: false,
    detectDoots: {},
    reveal: false,
    snackbar: false,
    snack:"",
    updateDetectRes: "",
    newStatus:"",
    dashMsg: "Now, we can use all this data to create a custom dashboard",
    ztaScores: "",
    ztaDetails: "",
    ztaInspect: false


  }),
  methods: {
    build: async function () {
      this.falcon = await Falcon.build(this.baseUrl, this.clientID, this.clientSecret, "falconjs-demo")
      try {
        this.token = await this.falcon.token
        this.snackbar = true
        this.snack = "Successfully authenticated"
      } catch (error) {
        console.log(error)
        return []
      }
    },
    queryHosts: async function () {
   /*    const commandName = "QueryDevicesByFilter"
      const params = {}
      const args = { commandName: commandName, params: params }
      try {
        this.devices = await this.falcon.command(args)
        this.hostMsg = "Click an ID for Host Details"
        this.snack = "Successfully retrieved " + this.devices.length + " Host ID's."
        this.snackbar = true
        console.log(this.devices)
        try{
          await this.getZta();
        } catch (error) {
          console.log(error)
          return
        }
        return (this.devices)
      } catch (error) {
        console.log("error")
        return
      } */
    },
    hostDetails: async function (id) {
      VueJsonPretty;
      console.log(id)
      // const commandName = "GetDeviceDetails"
      // const body = { ids: [id] }
      // const args = { commandName: commandName, body: body }
      // try {
      //   this.details = await this.falcon.command(args)
      //   this.dialog = true
      // } catch (error) {
      //   console.log("error")
      //   return
      // }
    },
    queryDetects: async function () {
      // const commandName = "QueryDetects"
      // const params = { offset: 0, filter: "first_behavior:>'2020-01-01'"}
      // const args = { commandName: commandName, params: params }
      // try {
      //   this.detects = await this.falcon.command(args)
      //   this.detectsMsg = "BORING. Lets get the details and whip up a table..."
      //   this.detectsClicked0 = true
      //   this.snackbar = true
      //   this.snack = "Successfully retrieved " + this.detects.length + " Detection IDs."
      //   console.log(this.detects)
      // } catch (error) {
      //   console.log("error")
      //   return
      // }
    },
    detectDetails: async function () {
      // const commandName = "GetDetectSummaries"
      // const body = { ids: this.detects }
      // const args = { commandName: commandName, body: body }
      // try {
      //   this.detDetails = await this.falcon.command(args)
      //   this.detectsMsg = "NICE... Check out the inspect button."
      //   this.detectsClicked = true
      //   console.log(this.detDetails)
      // } catch (error) {
      //   console.log(error)
      //   return
      // }
    },
    inspectDetect: function (deet) {
      this.detectDialog = true
      this.detectDoots = deet
    },
    updateDetect: async function (id, status) {
      console.log(id + status)
      // const commandName = "UpdateDetectsByIdsV2"
      //   const body = { ids: [id], status: status }
      //   const args = { commandName: commandName, body: body }
      //   try {
      //       this.updateDetectRes = await this.falcon.command(args)
      //       this.detectDetails()
      //       this.reveal = false
      //       this.detectDialog = false
      //     } catch (error) {
      //       console.log(error)
      //       return
      //   }
    },
    getZta: async function(){
      // const commandName = "getAuditV1"
      // const args = { commandName: commandName}
      // try {
      //   this.ztaScores = await this.falcon.command(args)
      //   try {
      //     await this.getZtaDetails()
      //   }
      //     catch(error){
      //       console.log(error)
      //       return
      //     }
      // } catch (error) {
      //   console.log(error)
      //   return
      // }
    },
    getZtaDetails: async function (){
      // const commandName = "getAssessmentsByScoreV1"
      // const params = { filter: "score:<=75"}
      // const args = { commandName: commandName, params: params }
      // try {
      //   this.ztaDetails = await this.falcon.command(args)
      //  } catch(error) {
      //     console.log(error)
      //     return
      //   }
      
    },
    containHost: async function(aid){
      console.log(aid)
      // const commandName = "PerformActionV2"
      // const body = {ids: [aid]}
      // const params = {action_name: "contain"}
      // const args = { commandName: commandName, body: body, params:params}
      // try {
      //   await this.falcon.command(args)
      // } catch ( error ) {
      //   console.log(error)
      //   return
      // }
    }
  }
}
</script>
<style>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>
