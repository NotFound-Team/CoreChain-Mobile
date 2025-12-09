// ==================== QUERY KEYS ====================
export const QUERY_KEYS = {
  // Auth
  AUTH: {
    ME: ["auth", "me"] as const,
  },
  // Users
  USERS: {
    ALL: ["users"] as const,
    DETAIL: (id: string) => ["users", id] as const,
  },
  // Projects
  PROJECTS: {
    ALL: ["projects"] as const,
    DETAIL: (id: string) => ["projects", id] as const,
    BY_USER: (userId: string) => ["projects", "user", userId] as const,
  },
  // Tasks
  TASKS: {
    ALL: ["tasks"] as const,
    DETAIL: (id: string) => ["tasks", id] as const,
    BY_PROJECT: (projectId: string) => ["tasks", "project", projectId] as const,
  },
  // Positions
  POSITIONS: {
    ALL: ["positions"] as const,
    DETAIL: (id: string) => ["positions", id] as const,
  },
} as const;

// ==================== TYPE HELPERS ====================
export type QueryKeyValue<T> = T extends readonly unknown[] ? T : never;

// ==================== CUSTOM QUERY OPTIONS ====================
export const DEFAULT_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  retry: 1,
  refetchOnWindowFocus: false,
} as const;

// ==================== EXAMPLE QUERIES ====================

/**
 * Example: useAuthMe query hook
 * 
 * import { authService } from "@/services/auth.service";
 * 
 * export const useAuthMe = () => {
 *   return useQuery({
 *     queryKey: QUERY_KEYS.AUTH.ME,
 *     queryFn: authService.getMe,
 *     ...DEFAULT_QUERY_OPTIONS,
 *   });
 * };
 */

/**
 * Example: useProjects query hook with parameters
 * 
 * import { projectService } from "@/services/project.service";
 * 
 * export const useProjects = (userId?: string) => {
 *   return useQuery({
 *     queryKey: userId 
 *       ? QUERY_KEYS.PROJECTS.BY_USER(userId) 
 *       : QUERY_KEYS.PROJECTS.ALL,
 *     queryFn: () => projectService.getProjects(userId),
 *     enabled: true, // Set to !!userId if you want to wait for userId
 *     ...DEFAULT_QUERY_OPTIONS,
 *   });
 * };
 */

/**
 * Example: useProjectDetail query hook
 * 
 * export const useProjectDetail = (id: string) => {
 *   return useQuery({
 *     queryKey: QUERY_KEYS.PROJECTS.DETAIL(id),
 *     queryFn: () => projectService.getProjectById(id),
 *     enabled: !!id,
 *     ...DEFAULT_QUERY_OPTIONS,
 *   });
 * };
 */
