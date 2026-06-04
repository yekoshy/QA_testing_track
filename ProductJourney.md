mermaid
```
---
config:
  layout: dagre
---
flowchart TB
    PLP(["🛒 Product List Page"]) -- Action: Click 'View More Details' --> PVP(["🔍 Product View Page"])
    PVP -- Action: Back to Catalog --> PLP
    PLP -. Action: Navigate Next/Prev Pages .-> PLP
    PLP -- Action: Click 'Add to Cart' --> CP(["🛍️ Cart Page"])
    PVP -- Action: Click 'Add to Cart' --> CP
    CP -. Action: Adjust Item Quantity .-> CP
    CP -. System: Refreshes Cart Totals .-> CP
    CP -- Action: Submit Cart to Checkout --> CO(["💳 Checkout Flow"])
    CO -- Condition: Unauthenticated User --> LP(["🔐 Login Page"])
    LP -- Action: Provide credentials & Login --> CO
    CO -- System Action: Create Order --> StateOpen[/"Order State: OPEN"/]
    StateOpen -- Action: Confirm Order --> StateAccepted[/"Order State: ACCEPTED"/]
    StateOpen -- Action: View Orders --> UP(["👤 User Page (Orders)"])
    StateAccepted -- Action: View Orders --> UP
    UP -. Action: Delete Order Only if OPEN .-> UP
    UP -- Action: Continue Shopping --> PLP

     PLP:::page
     PVP:::page
     CP:::page
     CO:::page
     LP:::page
     StateOpen:::system
     StateAccepted:::system
     UP:::page
    classDef page fill:#E3F2FD,stroke:#1565C0,stroke-width:2px,color:#0D47A1,font-weight:bold
    classDef system fill:#FFF3E0,stroke:#E65100,stroke-width:2px,stroke-dasharray:5 5,color:#E65100
```
