export enum TypeDepinNetwork {
  FRAXTAL_MAINNET,
}

export enum TypeDepinStatus {
  QUEUE,
  LIVE,
  CLOSED,
}

export interface DepinDeploymentProps {
  id: string
  name?: string
  sdl?: string
  akashHash?: string
  tokenId?: string
  chainId?: string
  hostURI?: string
  network?: TypeDepinNetwork
  depinFeature?: string
  status?: TypeDepinStatus
  workspaceId: string
  createdAt?: string
  updatedAt?: string
}

export interface NewDepinDeploymentProps {
  id?: string
  name?: string
  dseq?: string
  uri?: string
  tokenId?: string
  loading?: boolean
  evmHash?: string
  evmAddress?: string
  deployment?: any
  groups?: any
  escrow_account?: any
  lease: any
  createdAt: string
}

export interface LeasesProps {
  lease: any
  escrow_payment?: any
}

export interface FakeDepinProps {
  dseq?: any
  name?: any
  balance?: any
  cpu?: any
  gpu?: any
  ram?: any
  mb?: any
  rate?: any
  blockHeight?: any
  loading?: boolean
  evmHash?: any
  evmAddress?: any
  akashHash?: any
}
// example of lease:
/*
"lease": {
  "lease_id": {
    "owner": "akash1c3er49222vygzm6g4djr52muf3mspqam6cpqpy",
    "dseq": "17158585",
    "gseq": 1,
    "oseq": 1,
    "provider": "akash1u5cdg7k3gl43mukca4aeultuz8x2j68mgwn28e"
  },
  "state": "closed",
  "price": {
    "denom": "uakt",
    "amount": "0.305958000000000000"
  },
  "created_at": "17158596",
  "closed_on": "17181604"
},
"escrow_payment": {
  "account_id": {
    "scope": "deployment",
    "xid": "akash1c3er49222vygzm6g4djr52muf3mspqam6cpqpy/17158585"
  },
  "payment_id": "1/1/akash1u5cdg7k3gl43mukca4aeultuz8x2j68mgwn28e",
  "owner": "akash1u5cdg7k3gl43mukca4aeultuz8x2j68mgwn28e",
  "state": "closed",
  "rate": {
    "denom": "uakt",
    "amount": "0.305958000000000000"
  },
  "balance": {
    "denom": "uakt",
    "amount": "0.481664000000000000"
  },
  "withdrawn": {
    "denom": "uakt",
    "amount": "7039"
  }
}
 */

// example of deployment:
/*
{
  "deployment": {
    "deployment_id": {
      "owner": "akash1c3er49222vygzm6g4djr52muf3mspqam6cpqpy",
      "dseq": "16945025"
    },
    "state": "closed",
    "version": "//ihPzZ0Pk61ddgSCZOOFEQ2EfYe6O4Iqq81NH7zgug=",
    "created_at": "16945028"
  },
  "groups": [
    {
      "group_id": {
        "owner": "akash1c3er49222vygzm6g4djr52muf3mspqam6cpqpy",
        "dseq": "16945025",
        "gseq": 1
      },
      "state": "closed",
      "group_spec": {
        "name": "akash",
        "requirements": {
          "signed_by": {
            "all_of": [
            ],
            "any_of": [
              "akash1365yvmc4s7awdyj3n2sav7xfx76adc6dnmlx63",
              "akash18qa2a2ltfyvkyj0ggj3hkvuj6twzyumuaru9s4"
            ]
          },
          "attributes": [
            {
              "key": "host",
              "value": "akash"
            }
          ]
        },
        "resources": [
          {
            "resource": {
              "id": 1,
              "cpu": {
                "units": {
                  "val": "1000"
                },
                "attributes": [
                ]
              },
              "memory": {
                "quantity": {
                  "val": "536870912"
                },
                "attributes": [
                ]
              },
              "storage": [
                {
                  "name": "default",
                  "quantity": {
                    "val": "536870912"
                  },
                  "attributes": [
                  ]
                }
              ],
              "gpu": {
                "units": {
                  "val": "0"
                },
                "attributes": [
                ]
              },
              "endpoints": [
                {
                  "kind": "SHARED_HTTP",
                  "sequence_number": 0
                }
              ]
            },
            "count": 1,
            "price": {
              "denom": "uakt",
              "amount": "10000.000000000000000000"
            }
          }
        ]
      },
      "created_at": "16945028"
    }
  ],
  "escrow_account": {
    "id": {
      "scope": "deployment",
      "xid": "akash1c3er49222vygzm6g4djr52muf3mspqam6cpqpy/16945025"
    },
    "owner": "akash1c3er49222vygzm6g4djr52muf3mspqam6cpqpy",
    "state": "closed",
    "balance": {
      "denom": "uakt",
      "amount": "0.000000000000000000"
    },
    "transferred": {
      "denom": "uakt",
      "amount": "0.000000000000000000"
    },
    "settled_at": "16945051",
    "depositor": "akash1c3er49222vygzm6g4djr52muf3mspqam6cpqpy",
    "funds": {
      "denom": "uakt",
      "amount": "0.000000000000000000"
    }
  }
}, */
