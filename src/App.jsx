import { useState } from "react"

import { Header } from "./components/Header"
import { VariableSlider } from "./components/VariableSlider" 
import { VariableSwitches } from "./components/VariableSwitches"
import { TestInputs } from "./components/TestInputs"

export default function App() {
  const [blockSize, setBlockSize] = useState(2) // 2, 4, 8, 16
  const [numBlocks, setNumBlocks] = useState(4) // 4, 8, 16
  const [readPolicy, setReadPolicy] = useState("LT") // LT or NLT
  const [replacement, setReplacement] = useState("LRU") // MRU or MRU
  const [sequence, setSequence] = useState([]) // Array of Number representing the sequence of memory accesses
  const [testType, setTestType] = useState("Sequential") // Sequential, Mid-Repeat, Random, Custom
  const [submitted, setSubmitted] = useState(null) // USE THIS OBJECT WHEN WORKING WITH BACKEND LOGIC: The object containing BlockSize, NumBlocks, ReadPolicy, Replacement, Sequence, TestType
  const [inputsValid, setInputsValid] = useState(true)
  const [selectedTrace, setSelectedTrace] = useState("Step-By-Step") //Step-by-Step or Final Snapshot

  const clearSubmitted = () => setSubmitted(null)
  const changed = (setter) => (value) => {
    setter(value)
    clearSubmitted()
  }

  const handleSubmit = () => {
    setSubmitted({ blockSize, numBlocks, readPolicy, replacement, testType, sequence, selectedTrace })
    console.log("Submitted Inputs:", submitted)
  }

  return (
    <>
      <Header/>
      <main className="flex flex-col gap-8 p-14">
        <div className="flex flex-row justify-between items-center w-full gap-2">
          <div className="gap-4 flex flex-row justify-between items-center w-full">
            <VariableSlider label="Block Size" onChange={changed(setBlockSize)} />
            <VariableSlider label="# Cache Blocks" onChange={changed(setNumBlocks)} />
          </div>
          <div className="flex flex-col justify-between items-center gap-2 w-full">
            <h2 className="text-xl font-semibold">Full Associative</h2>
            <VariableSwitches left="LT" right="NLT" onChange={changed(setReadPolicy)} />
            <VariableSwitches left="LRU" right="MRU" onChange={changed(setReplacement)} />
          </div>
          <div className="flex flex-col justify-between items-stretch gap-2 w-full">
            <TestInputs numBlocks={numBlocks} onChange={setSequence} onTypeChange={setTestType} onEdit={clearSubmitted} onValidChange={setInputsValid}/>
          </div>
          <div className="gap-4 flex flex-col justify-center items-center w-full">
            <form className="flex flex-col gap-2 justify-center items-center">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="plan"
                  value="Step-By-Step"
                  checked={selectedTrace === "Step-By-Step"}
                  onChange={(e) => changed(setSelectedTrace)(e.target.value)}
                  className="h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-full border-2 border-black bg-white transition-colors checked:border-[#000080] checked:bg-[#000080] checked:shadow-[inset_0_0_0_3px_white]"
                />
                Step-By-Step
              </label>

              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="plan"
                  value="Final Snapshot"
                  checked={selectedTrace === "Final Snapshot"}
                  onChange={(e) => changed(setSelectedTrace)(e.target.value)}
                  className="h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-full border-2 border-black bg-white transition-colors checked:border-[#000080] checked:bg-[#000080] checked:shadow-[inset_0_0_0_3px_white]"
                />
                Final Snapshot
              </label>
            </form>
            <button type="button" onClick={handleSubmit} disabled={!inputsValid} className="rounded bg-[#000080] px-6 py-2 font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
              Trace and Simulate Caching
            </button>
          </div>
        </div>        

        {submitted && (
          <section className="flex flex-col gap-1 rounded border border-black p-4">
            <h2 className="text-xl font-semibold">Submitted Inputs</h2>
            <p>Block Size: {submitted.blockSize} words</p>
            <p># Cache Blocks: {submitted.numBlocks}</p>
            <p>Read Policy: {submitted.readPolicy}</p>
            <p>Replacement: {submitted.replacement}</p>
            <p>Test Case: {submitted.testType}</p>
            <p>Sequence ({submitted.sequence.length} accesses): {submitted.sequence.join(", ")}</p>
            <p>Simulation Type: {submitted.selectedTrace}</p>
          </section>
        )}
      </main>
    </>
  )
}