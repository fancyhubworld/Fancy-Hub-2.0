import {
  createHistoryManager,
  recordHistoryAction,
  performUndo,
  performRedo,
  BuilderHistoryManager,
} from "../src/lib/builder-history-engine";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

interface MockSection {
  id: string;
  type: string;
  backgroundColor: string;
  paddingY: string;
  title: string;
}

interface MockEditorState {
  sections: MockSection[];
  activeThemeColor: string;
}

async function runSection66UndoRedoTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — SECTION 66: VISUAL BUILDER UNDO / REDO TEST SUITE");
  console.log("=======================================================================\n");

  try {
    // Initial State: 3 Sections on Homepage
    const initialState: MockEditorState = {
      sections: [
        { id: "sec_hero", type: "HERO_SLIDER", backgroundColor: "#1455D9", paddingY: "py-8", title: "Hero Banner" },
        { id: "sec_products", type: "PRODUCT_GRID", backgroundColor: "#FFFFFF", paddingY: "py-6", title: "Trending Sarees" },
        { id: "sec_trust", type: "TRUST_ASSURANCE", backgroundColor: "#F8FAFC", paddingY: "py-4", title: "Silk Mark Guarantee" },
      ],
      activeThemeColor: "#1455D9",
    };

    let history = createHistoryManager<MockEditorState>(initialState);
    assert(history.past.length === 0, "Initial history stack is empty");
    assert(history.present.sections.length === 3, "Initial state has 3 sections");

    // STEP 1: CHANGE COLOR (e.g. Hero background color #1455D9 -> #059669)
    console.log("--- STEP 1: CHANGE COLOR ---");
    const stateAfterColorChange: MockEditorState = {
      ...history.present,
      sections: history.present.sections.map((s) =>
        s.id === "sec_hero" ? { ...s, backgroundColor: "#059669" } : s
      ),
    };
    history = recordHistoryAction(history, stateAfterColorChange, "Change Hero background color to #059669");
    assert(history.past.length === 1, "Action 1 recorded: Past stack length = 1");
    assert(history.present.sections[0].backgroundColor === "#059669", "Hero color updated to #059669");

    // STEP 2: CHANGE SPACING (e.g. Trending Sarees padding py-6 -> py-16)
    console.log("\n--- STEP 2: CHANGE SPACING ---");
    const stateAfterSpacingChange: MockEditorState = {
      ...history.present,
      sections: history.present.sections.map((s) =>
        s.id === "sec_products" ? { ...s, paddingY: "py-16" } : s
      ),
    };
    history = recordHistoryAction(history, stateAfterSpacingChange, "Change Products vertical padding to py-16");
    assert(history.past.length === 2, "Action 2 recorded: Past stack length = 2");
    assert(history.present.sections[1].paddingY === "py-16", "Products padding updated to py-16");

    // STEP 3: DELETE WIDGET (e.g. Delete TRUST_ASSURANCE widget)
    console.log("\n--- STEP 3: DELETE WIDGET ---");
    const stateAfterDelete: MockEditorState = {
      ...history.present,
      sections: history.present.sections.filter((s) => s.id !== "sec_trust"),
    };
    history = recordHistoryAction(history, stateAfterDelete, "Delete Trust Assurance widget");
    assert(history.past.length === 3, "Action 3 recorded: Past stack length = 3");
    assert(history.present.sections.length === 2, "Sections reduced from 3 to 2");

    // =======================================================================
    // ADMIN UNDO SEQUENCE (UNDO ALL THREE CHANGES)
    // =======================================================================
    console.log("\n--- UNDO 1: UNDO WIDGET DELETION ---");
    const undo1 = performUndo(history);
    history = undo1.manager;
    assert(undo1.success === true, "Undo 1 executed successfully");
    assert(history.present.sections.length === 3, "Deleted widget restored! Section count = 3");
    assert(history.present.sections[2].id === "sec_trust", "Trust Assurance widget is back in present state");
    assert(history.future.length === 1, "Redo stack has 1 entry");

    console.log("\n--- UNDO 2: UNDO SPACING CHANGE ---");
    const undo2 = performUndo(history);
    history = undo2.manager;
    assert(undo2.success === true, "Undo 2 executed successfully");
    assert(history.present.sections[1].paddingY === "py-6", "Products padding reverted back from py-16 to py-6!");
    assert(history.future.length === 2, "Redo stack has 2 entries");

    console.log("\n--- UNDO 3: UNDO COLOR CHANGE ---");
    const undo3 = performUndo(history);
    history = undo3.manager;
    assert(undo3.success === true, "Undo 3 executed successfully");
    assert(history.present.sections[0].backgroundColor === "#1455D9", "Hero color reverted back from #059669 to #1455D9!");
    assert(history.past.length === 0, "All 3 actions undone! Past stack is now empty");
    assert(history.future.length === 3, "Redo stack now has all 3 undone actions");

    // =======================================================================
    // ADMIN REDO SEQUENCE (REDO ALL THREE CHANGES)
    // =======================================================================
    console.log("\n--- REDO 1: REDO COLOR CHANGE ---");
    const redo1 = performRedo(history);
    history = redo1.manager;
    assert(redo1.success === true, "Redo 1 executed successfully");
    assert(history.present.sections[0].backgroundColor === "#059669", "Hero color restored to #059669");

    console.log("\n--- REDO 2: REDO SPACING CHANGE ---");
    const redo2 = performRedo(history);
    history = redo2.manager;
    assert(redo2.success === true, "Redo 2 executed successfully");
    assert(history.present.sections[1].paddingY === "py-16", "Products padding restored to py-16");

    console.log("\n--- REDO 3: REDO DELETE WIDGET ---");
    const redo3 = performRedo(history);
    history = redo3.manager;
    assert(redo3.success === true, "Redo 3 executed successfully");
    assert(history.present.sections.length === 2, "Trust widget deleted again. Count = 2");
    assert(history.future.length === 0, "Redo stack is now empty");

    console.log("\n=======================================================================");
    console.log(`Section 66 Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution error:", e);
    process.exit(1);
  }
}

runSection66UndoRedoTests();
