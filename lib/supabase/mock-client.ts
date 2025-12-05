/**
 * Mock Supabase Client for Testing
 * Simulates auth and DB operations without needing real credentials
 */

interface User {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
}

interface Session {
  user: User;
}

interface MockSupabaseClient {
  auth: {
    signUpWithPassword: (opts: { email: string; password: string }) => Promise<any>;
    signInWithPassword: (opts: { email: string; password: string }) => Promise<any>;
    signOut: () => Promise<any>;
    getSession: () => Promise<{ data: { session: Session | null } }>;
    onAuthStateChange: (callback: (event: string, session: Session | null) => void) => void;
  };
  from: (table: string) => {
    select: (fields?: string) => any;
    insert: (data: any) => any;
    update: (data: any) => any;
    delete: () => any;
    eq: (col: string, val: any) => any;
  };
}

// Mock storage - using global scope so data persists across instances
(global as any).mockUsers = (global as any).mockUsers || new Map();
(global as any).mockAgents = (global as any).mockAgents || new Map();
(global as any).mockLogs = (global as any).mockLogs || [];
(global as any).currentSession = (global as any).currentSession || null;

const getMockUsers = () => (global as any).mockUsers;
const getMockAgents = () => (global as any).mockAgents;
const getMockLogs = () => (global as any).mockLogs;
const getCurrentSession = () => (global as any).currentSession;
const setCurrentSession = (session: Session | null) => {
  (global as any).currentSession = session;
};

export function createMockSupabaseClient(): MockSupabaseClient {
  return {
    auth: {
      async signUpWithPassword({ email, password }) {
        const id = `user_${Date.now()}`;
        const mockUsers = getMockUsers();
        mockUsers.set(email, { email, password, id });
        setCurrentSession({ user: { id, email } });
        return { data: { user: { id, email } }, error: null };
      },

      async signInWithPassword({ email, password }) {
        const mockUsers = getMockUsers();
        const user = mockUsers.get(email);
        if (!user || user.password !== password) {
          return { data: null, error: { message: "Invalid credentials" } };
        }
        const session = { user: { id: user.id, email } };
        setCurrentSession(session);
        return { data: { session }, error: null };
      },

      async signOut() {
        setCurrentSession(null);
        return { error: null };
      },

      async getSession() {
        return { data: { session: getCurrentSession() } };
      },

      onAuthStateChange(callback) {
        callback("INITIAL_SESSION", getCurrentSession());
      },
    },

    from(table: string) {
      return {
        select(fields?: string) {
          return {
            eq: (col: string, val: any) => ({
              limit: (n: number) => ({
                async maybeSingle() {
                  if (table === "agents") {
                    const mockAgents = getMockAgents();
                    const agents = Array.from(mockAgents.values()).filter((a: any) => a[col] === val);
                    return { data: agents[0] || null, error: null };
                  }
                  return { data: null, error: null };
                },
              }),
              async maybeSingle() {
                if (table === "agents") {
                  const mockAgents = getMockAgents();
                  const agents = Array.from(mockAgents.values()).filter((a: any) => a[col] === val);
                  return { data: agents[0] || null, error: null };
                }
                return { data: null, error: null };
              },
            }),
            async then(cb: any) {
              if (table === "agents") {
                const mockAgents = getMockAgents();
                const agents = Array.from(mockAgents.values());
                return cb({ data: agents, error: null });
              }
              return cb({ data: [], error: null });
            },
          };
        },

        insert(data: any): any {
          const insertData = Array.isArray(data) ? data[0] : data;
          let resultData: any = insertData;
          
          if (table === "agents") {
            const id = `agent_${Date.now()}`;
            const mockAgents = getMockAgents();
            resultData = { id, ...insertData, created_at: new Date().toISOString() };
            mockAgents.set(id, resultData);
          } else if (table === "agent_logs") {
            const mockLogs = getMockLogs();
            mockLogs.push(insertData);
          }
          
          const result = { data: resultData, error: null };
          const chainable = {
            select: () => ({
              single: () => Promise.resolve(result),
            }),
          };
          return Object.assign(Promise.resolve(result), chainable);
        },

        update(data: any) {
          return {
            eq: (col: string, val: any) => ({
              async then(cb: any) {
                return cb({ data, error: null });
              },
            }),
          };
        },

        delete() {
          return {
            eq: (col: string, val: any) => ({
              async then(cb: any) {
                return cb({ data: null, error: null });
              },
            }),
          };
        },

        eq(col: string, val: any) {
          return this.select();
        },
      };
    },
  };
}

// For server-side testing
export function createMockAdminSupabaseClient() {
  return createMockSupabaseClient();
}
