// ==========================================
// TYPES POUR L'AUTHENTIFICATION
// ==========================================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
  expiresAt: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  roles: string[];
  expiresAt: string;
}

// ==========================================
// TYPES POUR LES ARTICLES
// ==========================================

export interface ArticleRequest {
  title: string;
  contenu: string;
  published: boolean;
  tags?: string[];
}

export interface ArticleResponse {
  id: number;
  title: string;
  contenu: string;
  published: boolean;
  createdAt: string;
  updateAt: string;
  publishedAt: string | null;
  tags: string[];
  authorId: number;
  authorUsername: string;
  commentsCount: number;
}

export interface ArticleUpdate {
  title?: string;
  contenu?: string;
  published?: boolean;
  tags?: string[];
}

// ==========================================
// TYPES POUR LES COMMENTAIRES
// ==========================================

export interface CommentRequest {
  contenu: string;
  articleId: number;
  parentId?: number | null;
}

export interface CommentResponse {
  id: number;
  contenu: string;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  authorUsername: string;
  articleId: number;
  articleTitle?: string;
  parentId: number | null;
  parentAuthorUsername: string | null;
}

export interface CommentUpdate {
  contenu: string;
  articleId: number;
  parentId?: number | null;
}

// ==========================================
// TYPES POUR LA PAGINATION
// ==========================================

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
}

export interface PageResponse<T> {
  content: T[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

// ==========================================
// TYPES POUR LES RÉPONSES D'ERREUR
// ==========================================

export interface ApiError {
  message: string;
  timestamp?: string;
  path?: string;
  status?: number;
  error?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  rejectedValue?: any;
}

export interface ValidationErrorResponse extends ApiError {
  validationErrors?: ValidationError[];
}

// ==========================================
// TYPES POUR LES RÉPONSES GÉNÉRIQUES
// ==========================================

export interface SuccessResponse {
  message: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success: boolean;
}

// ==========================================
// TYPES POUR LES PARAMÈTRES DE REQUÊTE
// ==========================================

export interface PaginationParams {
  page?: number;
  size?: number;
}

export interface SearchParams extends PaginationParams {
  keyword: string;
}

export interface ArticleFilters extends PaginationParams {
  published?: boolean;
  authorId?: number;
  tags?: string[];
}

// ==========================================
// TYPES POUR L'ÉTAT DE L'APPLICATION
// ==========================================

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface ArticleState {
  articles: ArticleResponse[];
  currentArticle: ArticleResponse | null;
  myArticles: ArticleResponse[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
}

export interface CommentState {
  comments: CommentResponse[];
  myComments: CommentResponse[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
}

// ==========================================
// TYPES POUR LES HOOKS PERSONNALISÉS
// ==========================================

export interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UsePaginationResult<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  totalElements: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  refresh: () => Promise<void>;
}

// ==========================================
// TYPES POUR LES COMPOSANTS
// ==========================================

export interface ArticleCardProps {
  article: ArticleResponse;
  showActions?: boolean;
  onEdit?: (article: ArticleResponse) => void;
  onDelete?: (id: number) => void;
  onTogglePublish?: (id: number) => void;
}

export interface CommentItemProps {
  comment: CommentResponse;
  showActions?: boolean;
  onEdit?: (comment: CommentResponse) => void;
  onDelete?: (id: number) => void;
  onReply?: (parentId: number) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

// ==========================================
// TYPES POUR LES FORMULAIRES
// ==========================================

export interface LoginFormData {
  username: string;
  password: string;
  remember?: boolean;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface ArticleFormData {
  title: string;
  contenu: string;
  published: boolean;
  tags: string;
}

export interface CommentFormData {
  contenu: string;
  parentId?: number;
}

// ==========================================
// TYPES POUR LES UTILITAIRES
// ==========================================

export interface FormattedDate {
  date: string;
  time: string;
  relative: string;
  full: string;
}

export interface TagInfo {
  name: string;
  count: number;
  color?: string;
}

export interface UserRole {
  name: string;
  permissions: string[];
}

// ==========================================
// ÉNUMÉRATIONS
// ==========================================

export enum ApiEndpoints {
  LOGIN = '/auth/login',
  REGISTER = '/auth/register',
  REFRESH = '/auth/refresh',
  LOGOUT = '/auth/logout',
  
  ARTICLES = '/articles',
  MY_ARTICLES = '/articles/mes_articles',
  ARTICLE_SEARCH = '/articles/search',
  ARTICLE_TOGGLE_PUBLISH = '/articles/{id}/toggle-publish',
  
  COMMENTS = '/commentaires',
  ARTICLE_COMMENTS = '/commentaires/article/{articleId}',
  MY_COMMENTS = '/commentaires/mes-commentaires',
}

export enum UserRoles {
  USER = 'ROLE_USER',
  ADMIN = 'ROLE_ADMIN'
}

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500
}

// ==========================================
// TYPES POUR LES CONSTANTES
// ==========================================

export const API_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  TOKEN_STORAGE_KEY: 'authToken',
  USER_STORAGE_KEY: 'user',
  REFRESH_TOKEN_STORAGE_KEY: 'refreshToken',
} as const;

export type ApiConstantKeys = keyof typeof API_CONSTANTS;
