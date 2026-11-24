import { useState } from "react"

import { Header } from "./components/Header"
import { VariableSlider } from "./components/VariableSlider" 
import { VariableSwitches } from "./components/VariableSwitches"
import { TestInputs } from "./components/TestInputs"
import { CacheBlocks } from "./components/CacheBlocks"
import { MemoryBlocks, hexWord } from "./components/MemoryBlocks"
import { AccessArrow } from "./components/AccessArrow"
import { computeStats } from "./utils/stats"
import { ACCESSES } from "./utils/accesses" // TO DO: REPLACE THIS ACCESSES DATA WITH THE ACTUAL OUTPUT BASED FROM THE INPUTS OF THE USERS FOR BACKEND DEVS

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
  const [step, setStep] = useState(0) // how many accesses have been stepped through (Step-By-Step mode)

  const clearSubmitted = () => {
    setSubmitted(null)
    setStep(0)
  }
  const changed = (setter) => (value) => {
    setter(value)
    clearSubmitted()
  }

  const handleSubmit = () => {
    setSubmitted({ blockSize, numBlocks, readPolicy, replacement, testType, sequence, selectedTrace })
    setStep(0)
    console.log("Submitted Inputs:", submitted)
  }

  // Steps come from ACCESSES (src/utils/accesses.ts). Final Snapshot applies every step at once.
  // const accesses; = call the function here that will return the built access table 
  const totalSteps = submitted ? ACCESSES.length : 0
  const shownSteps = submitted?.selectedTrace === "Step-By-Step" ? step : totalSteps
  const shownAccesses = ACCESSES.slice(0, shownSteps)
  const current = shownSteps > 0 ? ACCESSES[shownSteps - 1] : null // latest step shown
  const stats = submitted ? computeStats(shownAccesses, submitted.blockSize, submitted.readPolicy) : null // updates every step
  const statusLabel = { miss: "Miss", hit: "Hit", replace: "Replace" }
  const traceLog = shownAccesses.map((a, i) => `Step ${i + 1}: ${statusLabel[a.status]} block ${a.memoryBlock} → cache block ${a.cacheBlock}`) // OPTIONAL TO DO: revise this if you think iba dapat format nung log 

  // What each cache block holds right now: the memory block number and the word addresses it contains.
  const cacheData = []
  for (const a of shownAccesses) {
    cacheData[a.cacheBlock] = {
      tag: String(a.memoryBlock),
      words: Array.from({ length: submitted.blockSize }, (_, w) => hexWord(a.memoryBlock * submitted.blockSize + w)),
    }
  }

  return (
    <>
      <Header/>
      <main className="flex flex-col gap-8 p-14">
        <div className="flex flex-row justify-between items-center w-full gap-2 rounded-md border-[#000080]/25 border-2 p-4">
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
            <button type="button" onClick={handleSubmit} disabled={!inputsValid} className="rounded bg-[#000080] px-3 py-2 font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
              Submit Inputs and Trace
            </button>
          </div>
        </div>

          {!submitted && (
            <div className="flex flex-row justify-center items-center w-full gap-2">
              <h2 className="text-xl justify-between items-center font-semibold text-black/50">Please enter inputs</h2>
            </div>
          )}
          {submitted && (
            <section className="flex flex-row gap-1 p-4">
              <div className="flex flex-col flex-[2] min-w-0 justify-start p-2 gap-2 rounded-md border-[#000080]/25 border-2 p-4"> { /* BLOCKS */}
                {submitted.selectedTrace === "Step-By-Step" && (
                  <div className="flex flex-row items-center justify-end gap-4">
                    <span className="text-sm">Step {step} of {totalSteps}</span>
                    <button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      disabled={step >= totalSteps}
                      className="rounded bg-[#000080] px-4 py-1 font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
                <div className="relative flex w-full flex-1 flex-row items-start gap-24">
                  <CacheBlocks
                    blockSize={submitted.blockSize}
                    numBlocks={submitted.numBlocks}
                    data={cacheData}
                    highlight={current ? { line: current.cacheBlock, status: current.status } : undefined}
                  />
                  <MemoryBlocks blockSize={submitted.blockSize} highlight={current?.memoryBlock} />
                  {submitted.selectedTrace === "Step-By-Step" && current && (
                    <AccessArrow key={shownSteps} block={current.memoryBlock} cacheLine={current.cacheBlock} status={current.status} />
                  )}
                </div>
              </div>
              <div className="flex flex-col flex-1 min-w-0 break-words justify-start p-2 gap-2 rounded-md border-[#000080]/25 border-2 p-4"> { /* TEXT LOG */}
                <h2 className="text-sm font-semibold">Trace Log</h2>
                <div className="relative min-h-0 flex-1">
                  <div className="absolute inset-0 flex flex-col gap-1 overflow-y-auto">
                    {traceLog.length === 0 && <p className="text-xs text-gray-500">Press Next to start.</p>}
                    {traceLog.map((line, i) => (
                      <p key={i} className="text-xs">{line}</p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col flex-1 min-w-0 break-words justify-start p-2 gap-2 rounded-md border-[#000080]/25 border-2 p-4"> { /* SUBMITTED */}
                <h2 className="text-sm font-semibold">Submitted Inputs</h2>
                <p className="text-xs">Block Size: {submitted.blockSize} words</p>
                <p className="text-xs"># Cache Blocks: {submitted.numBlocks}</p>
                <p className="text-xs">Read Policy: {submitted.readPolicy}</p>
                <p className="text-xs">Replacement: {submitted.replacement}</p>
                <p className="text-xs">Test Case: {submitted.testType}</p>
                <p className="text-xs">Sequence ({submitted.sequence.length} accesses): {submitted.sequence.join(", ")}</p>
                <p className="text-xs">Simulation Type: {submitted.selectedTrace}</p>

                <h2 className="text-sm font-semibold">Statistics</h2>
                <p className="text-xs">Total Memory Accesses: {stats.total}</p>
                <p className="text-xs">Cache Hit Count: {stats.hits}</p>
                <p className="text-xs">Cache Miss Count: {stats.misses}</p>
                <p className="text-xs">Cache Hit Rate: {stats.hitRate.toFixed(2)}%</p>
                <p className="text-xs">Cache Miss Rate: {stats.missRate.toFixed(2)}%</p>
                <p className="text-xs">Average Memory Access Time: {stats.averageTime.toFixed(2)} ns</p>
                <p className="text-xs">Total Memory Access Time: {stats.totalTime} ns</p>
              </div>
            </section>
          )}  
      </main>
    </>
  )
}