import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from '@/shared/components/ui/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/Form";
import { Input } from "@/shared/components/ui/Input";
import AuthLayout from "@/components/layout/AuthLayout";
import { signIn } from "@/lib/supabase/auth";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/features/auth/context/AuthContext";

interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticating, authError, updateUserData } = useAuth();
  
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle navigation when auth state changes
  useEffect(() => {
    if (user && !isAuthenticating) {
      // If already authenticated, redirect based on role
      const isAdmin = user.email?.includes('admin');
      navigate(isAdmin ? '/admin/dashboard' : '/dashboard', { replace: true });
    }
  }, [user, isAuthenticating, navigate]);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      console.log("Attempting login with email:", values.email);
      
      const response = await signIn(values.email, values.password);
      
      if (response) {
        await updateUserData();
        toast({
          title: "تم تسجيل الدخول بنجاح!",
          description: "أهلاً بك مجدداً",
        });
        const isAdmin = response.email?.includes('admin');
        navigate(isAdmin ? '/admin/dashboard' : '/dashboard', { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "فشل تسجيل الدخول",
        description: "يرجى التحقق من بيانات الاعتماد والمحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show error message if authentication failed
  if (authError) {
    return (
      <AuthLayout
        title="خطأ في تسجيل الدخول"
        description={authError}
      >
        <div className="flex flex-col items-center gap-4">
          <Button asChild>
            <Link to="/login">المحاولة مرة أخرى</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  // If already authenticated, redirect
  if (user) {
    const isAdmin = user.email?.includes('admin');
    navigate(isAdmin ? '/admin/dashboard' : '/dashboard', { replace: true });
    return null;
  }

  return (
    <AuthLayout
      title="تسجيل الدخول"
      description="قم بتسجيل الدخول للوصول إلى حسابك"
      footer={
        <div className="ar">
          ليس لديك حساب؟{" "}
          <Link to="/register" className="text-primary hover:underline font-medium">
            اشتراك جديد
          </Link>
        </div>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "البريد الإلكتروني مطلوب",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "بريد إلكتروني غير صالح",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="ar">البريد الإلكتروني</FormLabel>
                <FormControl>
                  <Input {...field} type="email" autoComplete="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            rules={{ required: "كلمة المرور مطلوبة" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="ar">كلمة المرور</FormLabel>
                <FormControl>
                  <Input {...field} type="password" autoComplete="current-password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default Login;
