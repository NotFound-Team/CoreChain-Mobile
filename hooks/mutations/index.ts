
// ==================== MUTATION KEYS ====================
export const MUTATION_KEYS = {
  // Auth
  AUTH: {
    LOGIN: ["auth", "login"] as const,
    REGISTER: ["auth", "register"] as const,
    LOGOUT: ["auth", "logout"] as const,
  },
  // Projects
  PROJECTS: {
    CREATE: ["projects", "create"] as const,
    UPDATE: ["projects", "update"] as const,
    DELETE: ["projects", "delete"] as const,
  },
  // Tasks
  TASKS: {
    CREATE: ["tasks", "create"] as const,
    UPDATE: ["tasks", "update"] as const,
    DELETE: ["tasks", "delete"] as const,
  },
  // Users
  USERS: {
    UPDATE: ["users", "update"] as const,
    DELETE: ["users", "delete"] as const,
  },
} as const;

// ==================== TYPE HELPERS ====================
export type MutationKeyValue<T> = T extends readonly unknown[] ? T : never;

// ==================== MUTATION HELPER ====================
/**
 * Helper function to create mutation with auto-invalidation
 */
// export const createMutationWithInvalidation = <TData, TError, TVariables>(
//   mutationFn: (variables: TVariables) => Promise<TData>,
//   invalidateKeys: readonly (readonly string[])[],
//   options?: Omit<
//     UseMutationOptions<TData, TError, TVariables>,
//     "mutationFn" | "onSuccess"
//   >
// ) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn,
//     onSuccess: () => {
//       invalidateKeys.forEach((key) => {
//         queryClient.invalidateQueries({ queryKey: [...key] });
//       });
//     },
//     ...options,
//   });
// };

// ==================== EXAMPLE MUTATIONS ====================

/**
 * Example: useLogin mutation hook
 * 
 * import { loginAuth } from "@/services/auth.service";
 * 
 * export const useLogin = () => {
 *   const queryClient = useQueryClient();
 * 
 *   return useMutation({
 *     mutationKey: MUTATION_KEYS.AUTH.LOGIN,
 *     mutationFn: loginAuth,
 *     onSuccess: (data) => {
 *       // Save token to storage
 *       // Invalidate auth queries
 *       queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
 *     },
 *     onError: (error) => {
 *       console.error("Login failed:", error);
 *     },
 *   });
 * };
 */

/**
 * Example: useCreateProject mutation hook with optimistic update
 * 
 * import { projectService } from "@/services/project.service";
 * 
 * export const useCreateProject = () => {
 *   const queryClient = useQueryClient();
 * 
 *   return useMutation({
 *     mutationKey: MUTATION_KEYS.PROJECTS.CREATE,
 *     mutationFn: projectService.createProject,
 *     onMutate: async (newProject) => {
 *       // Cancel any outgoing refetches
 *       await queryClient.cancelQueries({ queryKey: QUERY_KEYS.PROJECTS.ALL });
 * 
 *       // Snapshot the previous value
 *       const previousProjects = queryClient.getQueryData(QUERY_KEYS.PROJECTS.ALL);
 * 
 *       // Optimistically update
 *       queryClient.setQueryData(QUERY_KEYS.PROJECTS.ALL, (old: any[]) => [
 *         ...old,
 *         { ...newProject, id: "temp-id" },
 *       ]);
 * 
 *       return { previousProjects };
 *     },
 *     onError: (err, newProject, context) => {
 *       // Rollback on error
 *       queryClient.setQueryData(QUERY_KEYS.PROJECTS.ALL, context?.previousProjects);
 *     },
 *     onSettled: () => {
 *       // Always refetch after error or success
 *       queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.ALL });
 *     },
 *   });
 * };
 */

/**
 * Example: useDeleteTask mutation hook
 * 
 * export const useDeleteTask = () => {
 *   const queryClient = useQueryClient();
 * 
 *   return useMutation({
 *     mutationKey: MUTATION_KEYS.TASKS.DELETE,
 *     mutationFn: (taskId: string) => taskService.deleteTask(taskId),
 *     onSuccess: (_, taskId) => {
 *       // Invalidate tasks list
 *       queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS.ALL });
 *       // Remove the specific task from cache
 *       queryClient.removeQueries({ queryKey: QUERY_KEYS.TASKS.DETAIL(taskId) });
 *     },
 *   });
 * };
 */
