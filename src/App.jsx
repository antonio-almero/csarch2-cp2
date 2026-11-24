import { useState } from "react"

import { Header } from "./components/Header"
import { VariableSlider } from "./components/VariableSlider" 

export default function App() {
  const [blockSize, setBlockSize] = useState(2)
  const [numBlocks, setNumBlocks] = useState(4)

  return (
    <>
      <Header/>
      <main className="flex flex-col gap-8 p-8">
        <div className="flex flex-row gap-2">
          <VariableSlider label="Block Size" onChange={setBlockSize} />
          <VariableSlider label="# Cache Blocks" onChange={setNumBlocks} />
        </div>        
      </main>
    </>
  )
}