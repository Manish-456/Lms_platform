import { db } from "@/lib/db";
import { Category, Chapter, Course } from "@prisma/client";
import { getProgress } from "./get-progress";

type CoursewithProgressWithCategory = Course & {
    Category :Category;
    chapters : Chapter[] ;
    progress : number | null;
}
type TDashboardCourses = {
 completedCourses : CoursewithProgressWithCategory[];
 coursesOnProgress : CoursewithProgressWithCategory[];
}
export const getDashboardCourses = async(userId : string) : Promise<TDashboardCourses> => {
     try {
        const purchasedCourses = await db.purchase.findMany({
            where : {
            userId
            },
            select : {
                course : {
                    include : {
                        Category : true,
                        chapters: {
                            where: {
                                isPublished : true
                            }
                        }
                    }
                }
            }
        });

        const courses = purchasedCourses.map(purchase => purchase.course) as CoursewithProgressWithCategory[];

        for(let course of courses){
            const progress = await getProgress(userId, course.id);
            course["progress"] = progress!;
        }

        const completedCourses = courses.filter(course => course.progress === 100);
        const coursesOnProgress = courses.filter(course => (course.progress ?? 0) < 100);

        return {
            completedCourses,
            coursesOnProgress
        }
     } catch (error) {
        console.log(`[GET_DASHBOARD_COURSES]`, error);
        return {
            completedCourses : [], 
            coursesOnProgress : []}
     }
    
}