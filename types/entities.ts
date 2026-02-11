export type User = {
  _id: string;
  name: string;
  email: string;
  googleId: string;
  numberOfCourses: number;
  completedCourses: number;
  activeCourses: number;
  userType: 'default' | 'admin';
  avatarUrl?: string;
};

export type CheckIn = {
  _id: string;
  user: User;
  createdAt: string;
};
