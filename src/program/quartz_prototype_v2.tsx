export type QuartzPrototypeV2 = {
    "version": "0.1.0",
    "name": "quartz_prototype_v2",
    "constants": [
      {
        "name": "QUARTZ_HOLDING_ADDRESS",
        "type": "publicKey",
        "value": "pubkey ! (\"jNFx1wSfb8CUxe8UZwfD3GnkBKvMqiUg69JHYM1Pi2G\")"
      },
      {
        "name": "USDC_MINT_ADDRESS",
        "type": "publicKey",
        "value": "pubkey ! (\"envrJbV6GbhBTi8Pu6h9MwNViLuAmu3mFFRq7gE9Cp3\")"
      },
      {
        "name": "USDC_MINT_ADDRESS",
        "type": "publicKey",
        "value": "pubkey ! (\"4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU\")"
      },
      {
        "name": "USDC_MINT_ADDRESS",
        "type": "publicKey",
        "value": "pubkey ! (\"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v\")"
      }
    ],
    "instructions": [
      {
        "name": "initAccount",
        "accounts": [
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "type": "string",
                  "value": "vault"
                },
                {
                  "kind": "account",
                  "type": "publicKey",
                  "path": "owner"
                }
              ]
            }
          },
          {
            "name": "vaultAtaUsdc",
            "isMut": true,
            "isSigner": false,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "type": "string",
                  "value": "ata"
                },
                {
                  "kind": "account",
                  "type": "publicKey",
                  "path": "owner"
                },
                {
                  "kind": "account",
                  "type": "publicKey",
                  "account": "Mint",
                  "path": "token_mint"
                }
              ]
            }
          },
          {
            "name": "tokenMint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "closeAccount",
        "accounts": [
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "type": "string",
                  "value": "vault"
                },
                {
                  "kind": "account",
                  "type": "publicKey",
                  "path": "owner"
                }
              ]
            }
          },
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          }
        ],
        "args": []
      },
      {
        "name": "spendLamports",
        "accounts": [
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "type": "string",
                  "value": "vault"
                },
                {
                  "kind": "account",
                  "type": "publicKey",
                  "path": "owner"
                }
              ]
            }
          },
          {
            "name": "receiver",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amountLamports",
            "type": "u64"
          }
        ]
      },
      {
        "name": "transferLamports",
        "accounts": [
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "type": "string",
                  "value": "vault"
                },
                {
                  "kind": "account",
                  "type": "publicKey",
                  "path": "owner"
                }
              ]
            }
          },
          {
            "name": "receiver",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amountLamports",
            "type": "u64"
          }
        ]
      },
      {
        "name": "spendSpl",
        "accounts": [
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "type": "string",
                  "value": "vault"
                },
                {
                  "kind": "account",
                  "type": "publicKey",
                  "path": "owner"
                }
              ]
            }
          },
          {
            "name": "vaultAtaUsdc",
            "isMut": true,
            "isSigner": false,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "type": "string",
                  "value": "ata"
                },
                {
                  "kind": "account",
                  "type": "publicKey",
                  "path": "owner"
                },
                {
                  "kind": "account",
                  "type": "publicKey",
                  "account": "Mint",
                  "path": "token_mint"
                }
              ]
            }
          },
          {
            "name": "receiver",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "receiverAta",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenMint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amountSpl",
            "type": "u64"
          }
        ]
      },
      {
        "name": "transferSpl",
        "accounts": [
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "type": "string",
                  "value": "vault"
                },
                {
                  "kind": "account",
                  "type": "publicKey",
                  "path": "owner"
                }
              ]
            }
          },
          {
            "name": "vaultAtaUsdc",
            "isMut": true,
            "isSigner": false,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "type": "string",
                  "value": "ata"
                },
                {
                  "kind": "account",
                  "type": "publicKey",
                  "path": "owner"
                },
                {
                  "kind": "account",
                  "type": "publicKey",
                  "account": "Mint",
                  "path": "token_mint"
                }
              ]
            }
          },
          {
            "name": "receiver",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "receiverAta",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenMint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amountSpl",
            "type": "u64"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "vault",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "owner",
              "type": "publicKey"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "InsufficientFunds",
        "msg": "Insufficent funds for the transaction"
      }
    ]
  };
  
  export const IDL: QuartzPrototypeV2 = {
    "version": "0.1.0",
    "name": "quartz_prototype_v2",
    "constants": [
      {
        "name": "QUARTZ_HOLDING_ADDRESS",
        "type": "publicKey",
        "value": "pubkey ! (\"jNFx1wSfb8CUxe8UZwfD3GnkBKvMqiUg69JHYM1Pi2G\")"
      },
      {
        "name": "USDC_MINT_ADDRESS",
        "type": "publicKey",
        "value": "pubkey ! (\"envrJbV6GbhBTi8Pu6h9MwNViLuAmu3mFFRq7gE9Cp3\")"
      },
      {
        "name": "USDC_MINT_ADDRESS",
        "type": "publicKey",
        "value": "pubkey ! (\"4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU\")"
      },
      {
        "name": "USDC_MINT_ADDRESS",
        "type": "publicKey",
        "value": "pubkey ! (\"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v\")"
      }
    ],
    "instructions": [
      {
        "name": "initAccount",
        "accounts": [
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "type": "string",
                  "value": "vault"
                },
                {
                  "kind": "account",
                  "type": "publicKey",
                  "path": "owner"
                }
              ]
            }
          },
          {
            "name": "vaultAtaUsdc",
            "isMut": true,
            "isSigner": false,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "type": "string",
                  "value": "ata"
                },
                {
                  "kind": "account",
                  "type": "publicKey",
                  "path": "owner"
                },
                {
                  "kind": "account",
                  "type": "publicKey",
                  "account": "Mint",
                  "path": "token_mint"
                }
              ]
            }
          },
          {
            "name": "tokenMint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "closeAccount",
        "accounts": [
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "type": "string",
                  "value": "vault"
                },
                {
                  "kind": "account",
                  "type": "publicKey",
                  "path": "owner"
                }
              ]
            }
          },
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          }
        ],
        "args": []
      },
      {
        "name": "spendLamports",
        "accounts": [
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "type": "string",
                  "value": "vault"
                },
                {
                  "kind": "account",
                  "type": "publicKey",
                  "path": "owner"
                }
              ]
            }
          },
          {
            "name": "receiver",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amountLamports",
            "type": "u64"
          }
        ]
      },
      {
        "name": "transferLamports",
        "accounts": [
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "type": "string",
                  "value": "vault"
                },
                {
                  "kind": "account",
                  "type": "publicKey",
                  "path": "owner"
                }
              ]
            }
          },
          {
            "name": "receiver",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amountLamports",
            "type": "u64"
          }
        ]
      },
      {
        "name": "spendSpl",
        "accounts": [
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "type": "string",
                  "value": "vault"
                },
                {
                  "kind": "account",
                  "type": "publicKey",
                  "path": "owner"
                }
              ]
            }
          },
          {
            "name": "vaultAtaUsdc",
            "isMut": true,
            "isSigner": false,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "type": "string",
                  "value": "ata"
                },
                {
                  "kind": "account",
                  "type": "publicKey",
                  "path": "owner"
                },
                {
                  "kind": "account",
                  "type": "publicKey",
                  "account": "Mint",
                  "path": "token_mint"
                }
              ]
            }
          },
          {
            "name": "receiver",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "receiverAta",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenMint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amountSpl",
            "type": "u64"
          }
        ]
      },
      {
        "name": "transferSpl",
        "accounts": [
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "type": "string",
                  "value": "vault"
                },
                {
                  "kind": "account",
                  "type": "publicKey",
                  "path": "owner"
                }
              ]
            }
          },
          {
            "name": "vaultAtaUsdc",
            "isMut": true,
            "isSigner": false,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "type": "string",
                  "value": "ata"
                },
                {
                  "kind": "account",
                  "type": "publicKey",
                  "path": "owner"
                },
                {
                  "kind": "account",
                  "type": "publicKey",
                  "account": "Mint",
                  "path": "token_mint"
                }
              ]
            }
          },
          {
            "name": "receiver",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "receiverAta",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenMint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amountSpl",
            "type": "u64"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "vault",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "owner",
              "type": "publicKey"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "InsufficientFunds",
        "msg": "Insufficent funds for the transaction"
      }
    ]
  };
  