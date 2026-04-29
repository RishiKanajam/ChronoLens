import {
  createWorkspace,
  getWorkspace,
  regenerateLesson as regenerateStoredLesson,
  regenerateStudy as regenerateStoredStudy,
} from "@/lib/workspaceStore";
import { LessonPack, StudyModule, Workspace } from "@/lib/types";

export { createWorkspace };

export function regenerateLesson(workspace: Workspace, overrides?: Partial<LessonPack>) {
  return regenerateStoredLesson(workspace.id, overrides) || workspace;
}

export function regenerateStudy(workspace: Workspace, overrides?: Partial<StudyModule>) {
  return regenerateStoredStudy(workspace.id, overrides) || workspace;
}

export { getWorkspace };
