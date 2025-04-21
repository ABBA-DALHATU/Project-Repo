"use server";

import { db } from "@/lib/prismaClient";
import { currentUser } from "@clerk/nextjs/server";
import { Role } from "@prisma/client";

import { ProjectStatus } from "@prisma/client"; // Import enums

export const onAuthenticate = async () => {
  try {
    const authUser = await currentUser();
    if (!authUser) return { data: null, status: 404 };

    const existingUser = await db.user.findUnique({
      where: { clerkId: authUser.id },
    });

    if (existingUser) return { data: existingUser, status: 200 };

    const newUser = await db.user.create({
      data: {
        clerkId: authUser.id,
        email: authUser.emailAddresses[0].emailAddress ?? "",
        imageUrl: authUser.imageUrl,
        firstName: authUser.firstName ?? "",
        lastName: authUser.lastName ?? "",
        fullName: authUser.fullName ?? "",
        role: (authUser.unsafeMetadata?.role as Role) || "STUDENT",
      },
    });

    console.log(existingUser, authUser, " ❌❌❌❌❌");

    if (newUser) return { data: newUser, status: 201 };

    return { data: null, status: 400 };
  } catch (error) {
    console.log(error);
    return { data: null, status: 500 };
  }
};

export const getStudentProjects = async () => {
  try {
    const authUser = await currentUser();
    if (!authUser) return { data: null, status: 404 };

    const userProjects = await db.user.findUnique({
      where: { clerkId: authUser.id },
      select: {
        projects: true,
        id: true,
      },
    });

    // const projects = await db.project.findMany({
    //   where: { studentId: userId },
    // });
    return { data: userProjects, status: 200 };
  } catch (error) {
    console.log(error);
    return { data: null, status: 500 };
  }
};

export const getRecentStudentProjects = async () => {
  try {
    const authUser = await currentUser();
    if (!authUser) return { data: null, status: 404 };

    const userProjects = await db.user.findUnique({
      where: { clerkId: authUser.id },
      select: {
        projects: {
          orderBy: {
            createdAt: "desc", // Order by createdAt in descending order
          },
          take: 5, // Limit to 3 projects
        },
        id: true,
      },
    });

    // const projects = await db.project.findMany({
    //   where: { studentId: userId },
    // });
    return { data: userProjects, status: 200 };
  } catch (error) {
    console.log(error);
    return { data: null, status: 500 };
  }
};

export const getSupervisorProjects = async () => {
  try {
    const authUser = await currentUser();
    if (!authUser) return { data: null, status: 404 };

    const userProjects = await db.user.findUnique({
      where: { clerkId: authUser.id },
      select: {
        supervisedProjects: {
          include: { student: true },
        },
      },
    });

    return { data: userProjects, status: 200 };
  } catch (error) {
    console.log(error);
    return { data: null, status: 500 };
  }
};

export const getRecentSupervisorProjects = async () => {
  try {
    const authUser = await currentUser();
    if (!authUser) return { data: null, status: 404 };

    const userProjects = await db.user.findUnique({
      where: { clerkId: authUser.id },
      select: {
        supervisedProjects: {
          include: { student: true },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
      },
    });

    return { data: userProjects, status: 200 };
  } catch (error) {
    console.log(error);
    return { data: null, status: 500 };
  }
};

// const testWinstonAIText = async () => {
//   const response = await fetch("https://api.gowinston.ai/v2/plagiarism", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.WINSTON_AI_API_KEY}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       text: "This is a test sentence to check whether the Winston AI plagiarism detection API is working correctly. The purpose of this request is to verify if the API key is valid and if the response returns a proper plagiarism score.",
//     }),
//   });

//   const data = await response.json();
//   console.log("Winston AI Text Check Response:", data);
// };

import mammoth from "mammoth";

async function extractTextFromDocx(fileBlob: Blob) {
  try {
    // Convert Blob to ArrayBuffer
    const arrayBuffer = await fileBlob.arrayBuffer();

    // Convert ArrayBuffer to Buffer
    const buffer = Buffer.from(arrayBuffer);

    // Extract text using Mammoth
    const result = await mammoth.extractRawText({ buffer });

    if (!result.value || result.value.length < 100) {
      throw new Error("Extracted text is too short for Winston AI.");
    }

    return result.value; // Return extracted text
  } catch (error) {
    console.error("Error extracting text from DOCX:", error);
    return "Could not extract text from document.";
  }
}

// import pdf from "pdf-parse";

// async function extractTextFromPdf(fileBlob: Blob) {
//   try {
//     const arrayBuffer = await fileBlob.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     const data = await pdf(buffer);

//     if (!data.text || data.text.length < 100) {
//       throw new Error("Extracted text is too short for Winston AI.");
//     }

//     return data.text; // Extracted text
//   } catch (error) {
//     console.error("Error extracting text from PDF:", error);
//     return "Could not extract text from document.";
//   }
// }

async function fetchAndExtractText(fileUrl: string) {
  try {
    console.log("Downloading file from UploadThing URL:", fileUrl);

    // 1️⃣ Fetch the file from UploadThing
    const response = await fetch(fileUrl);
    if (!response.ok)
      throw new Error("Failed to download file from UploadThing");

    const fileBlob = await response.blob();
    console.log("Downloaded file blob:", fileBlob);

    // 2️⃣ Determine file type
    const fileType = fileBlob.type;
    console.log("Detected file type:", fileType);

    let extractedText = "Could not extract text.";

    if (fileType.includes("word")) {
      extractedText = await extractTextFromDocx(fileBlob);
    } else if (fileType.includes("pdf")) {
      // extractedText = await extractTextFromPdf(fileBlob);
      console.log("pdf");
    } else {
      throw new Error("Unsupported file type.");
    }

    console.log(
      "Extracted Text (first 200 chars):",
      extractedText.slice(0, 200)
    );

    return extractedText.slice(0, 100);
  } catch (error) {
    console.error("Error extracting text:", error);
    return "Could not extract text.";
  }
}

async function sendTextToWinstonAI(text: string) {
  if (text.length < 100) {
    console.error("Text must be at least 100 characters for Winston AI.");
    return null;
  }

  const requestBody = JSON.stringify({ text });

  const response = await fetch("https://api.gowinston.ai/v2/plagiarism", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WINSTON_AI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: requestBody,
  });

  const data = await response.json();
  console.log("Plagiarism API Response:", data);
  return data;
}

async function checkForPlagiarism(fileUrl: string) {
  const text = await fetchAndExtractText(fileUrl);
  if (text) {
    return sendTextToWinstonAI(text);
  }

  console.log("No text ❌❌❌❌");
  return null;
}

// const fetchAndUploadFile = async (fileUrl: string) => {
//   try {
//     console.log("Downloading file from UploadThing URL:", fileUrl);

//     // 1️⃣ Fetch the file from UploadThing
//     const response = await fetch(fileUrl);
//     if (!response.ok)
//       throw new Error("Failed to download file from UploadThing");

//     // Convert response to Blob
//     const fileBlob = await response.blob();
//     console.log("Downloaded file blob:", fileBlob);

//     // 2️⃣ Ensure file type is valid
//     const fileType = fileBlob.type;
//     if (!fileType.includes("word") && !fileType.includes("pdf")) {
//       throw new Error("Invalid file type. Must be .docx or .pdf");
//     }

//     // 3️⃣ Convert Blob to File
//     const file = new File([fileBlob], "uploaded-file.docx", {
//       type: fileBlob.type,
//     });

//     console.log("File prepared for upload:", file);

//     // 4️⃣ Prepare FormData
//     const formData = new FormData();
//     formData.append("file", file); // Only send the file (not extracted text)

//     console.log("Sending file to Winston AI...");

//     // 5️⃣ Send file to Winston AI
//     const plagiarismResponse = await fetch(
//       "https://api.gowinston.ai/v2/plagiarism",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.WINSTON_AI_API_KEY}`,
//         },
//         body: formData, // FormData handles content-type
//       }
//     );

//     // 6️⃣ Log response
//     const data = await plagiarismResponse.json();
//     console.log("Plagiarism API Response:", data);

//     return data;
//   } catch (error) {
//     console.error("Error in plagiarism check:", error);
//     return null;
//   }
// };

export const upsertProject = async (values: any, userId: string) => {
  try {
    if (!values.fileUrl) throw new Error("No file URL provided!");

    // 1️⃣ Save the project first
    const proj = await db.project.upsert({
      where: { id: values?.id || "" },
      create: {
        title: values.title,
        description: values.description,
        fileUrl: values.fileUrl,
        studentId: userId,
        supervisorId: values.supervisorId,
        status: ProjectStatus.PENDING,
      },
      update: {
        title: values.title,
        description: values.description,
        fileUrl: values.fileUrl,
        studentId: userId,
        supervisorId: values.supervisorId,
      },
      include: { student: true },
    });

    console.log("Project submitted:", proj);

    //comeback

    // 2️⃣ Fetch file & send it to Winston AI
    // testWinstonAIText();
    const plagiarismData = await checkForPlagiarism(values.fileUrl);

    let plagiarismScore = null;
    let plagiarismReport = null;

    if (plagiarismData && !plagiarismData.error) {
      plagiarismScore = Number(plagiarismData?.result?.score) || null;
      plagiarismReport = JSON.stringify(plagiarismData?.sources || []);
    } else {
      console.warn("Plagiarism API Error:", plagiarismData?.error);
    }

    // 3️⃣ Update the project with plagiarism results
    const updatedProject = await db.project.update({
      where: { id: proj.id },
      data: {
        plagiarismScore,
        plagiarismReport,
      },
      include: { student: true },
    });

    console.log("Plagiarism check completed:", updatedProject);

    // 4️⃣ Notify Supervisor if Plagiarism is High (>50%)
    if (plagiarismScore !== null && plagiarismScore > 50) {
      await db.notification.create({
        data: {
          userId: values.supervisorId,
          message: `Plagiarism detected! ${plagiarismScore}% similarity in ${values.title}`,
          projectId: proj.id,
        },
      });
    }

    return proj;
  } catch (error) {
    console.error("Upsert Project Error:", error);
    throw error;
  }
};

////////////////////////text extraction

// import mammoth from "mammoth";

// async function extractTextFromDocx(fileBlob: any) {
//   try {
//     const arrayBuffer = await fileBlob.arrayBuffer();
//     const result = await mammoth.extractRawText({ arrayBuffer });
//     return result.value; // The extracted text
//   } catch (error) {
//     console.error("Error extracting text from DOCX:", error);
//     throw error;
//   }
// }

// const fetchAndExtractText = async (fileUrl: string) => {
//   try {
//     console.log("Downloading file from UploadThing URL:", fileUrl);

//     // 1️⃣ Fetch the file from UploadThing
//     const response = await fetch(fileUrl);
//     if (!response.ok)
//       throw new Error("Failed to download file from UploadThing");

//     // Convert response to Blob
//     const fileBlob = await response.blob();
//     console.log("Downloaded file blob:", fileBlob);

//     // 2️⃣ Determine file type
//     const fileType = fileBlob.type;
//     let extractedText = "No text extracted.";

//     // 3️⃣ Extract text based on file type

//     if (fileType.includes("word")) {
//       extractedText = await extractTextFromDocx(fileBlob);
//     } else {
//       throw new Error(
//         "Unsupported file type. Only .docx and .pdf are allowed."
//       );
//     }

//     console.log("Extracted Text:", extractedText.slice(0, 130)); // Log first 130 chars
//     return extractedText.slice(0, 130);
//   } catch (error) {
//     console.error("Error extracting text:", error);
//     return null;
//   }
// };

// const fetchAndExtractText = async (fileUrl: string) => {
//   try {
//     console.log("Downloading file from UploadThing URL:", fileUrl);

//     // 1️⃣ Fetch the file from UploadThing
//     const response = await fetch(fileUrl);
//     if (!response.ok)
//       throw new Error("Failed to download file from UploadThing");

//     // Convert response to Blob
//     const fileBlob = await response.blob();
//     console.log("Downloaded file blob:", fileBlob);

//     // 2️⃣ Determine file type
//     const fileType = fileBlob.type;
//     let extractedText = "No text extracted.";

//     // 3️⃣ Extract text based on file type
//     if (fileType.includes("word")) {
//       extractedText = await extractTextFromDocx(fileBlob);
//     } else if (fileType.includes("pdf")) {
//       extractedText = await extractTextFromPdf(fileBlob);
//     } else {
//       throw new Error(
//         "Unsupported file type. Only .docx and .pdf are allowed."
//       );
//     }

//     console.log("Extracted Text:", extractedText.slice(0, 130)); // Log first 200 chars
//     return extractedText.slice(0, 130);
//   } catch (error) {
//     console.error("Error extracting text:", error);
//     return null;
//   }
// };

// const checkPlagiarism = async (extractedText: string) => {
//   try {
//     if (!extractedText || extractedText.length < 100) {
//       throw new Error("Text must be at least 100 characters for Winston AI.");
//     }

//     console.log("Sending extracted text to Winston AI...");

//     const response = await fetch("https://api.gowinston.ai/v2/plagiarism", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.WINSTON_AI_API_KEY}`,
//         // "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ text: extractedText }),
//     });

//     const data = await response.json();
//     console.log("Plagiarism API Response:", data);

//     return data;
//   } catch (error) {
//     console.error("Error in plagiarism check:", error);
//     return null;
//   }
// };

// const handlePlagiarismCheck = async (fileUrl: string) => {
//   const extractedText = await fetchAndExtractText(fileUrl);
//   if (extractedText) {
//     return await checkPlagiarism(extractedText);
//   }
//   return null;
// };

// export const upsertProject = async (values: any, userId: string) => {
//   try {
//     if (!values.fileUrl) throw new Error("No file URL provided!");

//     // 1️⃣ Save the project first
//     const proj = await db.project.upsert({
//       where: { id: values?.id || "" },
//       create: {
//         title: values.title,
//         description: values.description,
//         fileUrl: values.fileUrl,
//         studentId: userId,
//         supervisorId: values.supervisorId,
//         status: ProjectStatus.PENDING,
//       },
//       update: {
//         title: values.title,
//         description: values.description,
//         fileUrl: values.fileUrl,
//         studentId: userId,
//         supervisorId: values.supervisorId,
//       },
//       include: { student: true },
//     });

//     console.log("Project submitted:", proj);

//     // 2️⃣ Fetch file & send it to Winston AI
//     // testWinstonAIText();
//     const plagiarismData = await handlePlagiarismCheck(values.fileUrl);

//     let plagiarismScore = null;
//     let plagiarismReport = null;

//     if (plagiarismData && !plagiarismData.error) {
//       plagiarismScore = Number(plagiarismData?.result?.score) || null;
//       plagiarismReport = JSON.stringify(plagiarismData?.sources || []);
//     } else {
//       console.warn("Plagiarism API Error:", plagiarismData?.error);
//     }

//     // 3️⃣ Update the project with plagiarism results
//     const updatedProject = await db.project.update({
//       where: { id: proj.id },
//       data: {
//         plagiarismScore,
//         plagiarismReport,
//       },
//       include: { student: true },
//     });

//     console.log("Plagiarism check completed:", updatedProject);

//     // 4️⃣ Notify Supervisor if Plagiarism is High (>50%)
//     if (plagiarismScore !== null && plagiarismScore > 50) {
//       await db.notification.create({
//         data: {
//           userId: values.supervisorId,
//           message: `Plagiarism detected! ${plagiarismScore}% similarity in ${values.title}`,
//           projectId: proj.id,
//         },
//       });
//     }

//     return updatedProject;
//   } catch (error) {
//     console.error("Upsert Project Error:", error);
//     throw error;
//   }
// };

export const addNotification = async ({
  userId,
  description,
  projectId,
}: {
  userId: string;
  description: string;
  projectId?: string;
}) => {
  const userData = await db.user.findUnique({
    where: { id: userId },
  });

  if (!userData) {
    console.log("Could not find a user");
    return;
  }

  if (projectId) {
    await db.notification.create({
      data: {
        message: `${userData.firstName} ${userData.lastName} | ${description}`,
        user: {
          connect: {
            id: userData.id,
          },
        },
        project: {
          connect: {
            id: projectId,
          },
        },
      },
    });
  } else {
    await db.notification.create({
      data: {
        message: `${userData.firstName} ${userData.lastName} | ${description}`,
        user: {
          connect: {
            id: userData.id,
          },
        },
      },
    });
  }
};

// export const getAllNotifications = async () => {
//   try {
//     const authUser = await currentUser();
//     if (!authUser) return null;

//     // Fetch notifications for the current user
//     const user = await db.user.findUnique({
//       where: { clerkId: authUser.id },
//       select: {
//         notifications: {
//           select: {
//             id: true,
//             message: true,
//             createdAt: true,
//             isRead: true,
//             user: {
//               select: {
//                 id: true,
//                 firstName: true,
//                 lastName: true,
//                 email: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!user || !user.notifications.length)
//       return { read: [], unread: [], all: [] };

//     // Separate read and unread notifications
//     const readNotifications: any[] = [];
//     const unreadNotifications: any[] = [];

//     user.notifications.forEach((notification) => {
//       if (notification.isRead) {
//         readNotifications.push(notification);
//       } else {
//         unreadNotifications.push(notification);
//       }
//     });

//     return {
//       read: readNotifications,
//       unread: unreadNotifications,
//       all: user.notifications,
//     };
//   } catch (error) {
//     console.error("Error fetching notifications:", error);
//     return null;
//   }
// };

// Define a type for the notification data
type NotificationWithUser = {
  id: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

// Define the return type for the function
type NotificationResult = {
  read: NotificationWithUser[];
  unread: NotificationWithUser[];
  all: NotificationWithUser[];
};

export const getAllNotifications =
  async (): Promise<NotificationResult | null> => {
    try {
      const authUser = await currentUser();
      if (!authUser) return null;

      // Fetch notifications for the current user
      const notifications = await db.notification.findMany({
        where: {
          user: {
            clerkId: authUser.id,
          },
        },
        select: {
          id: true,
          message: true,
          createdAt: true,
          isRead: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc", // Order by most recent first
        },
      });

      if (!notifications.length) {
        return { read: [], unread: [], all: [] };
      }

      // Separate read and unread notifications
      const readNotifications = notifications.filter(
        (notification) => notification.isRead
      );
      const unreadNotifications = notifications.filter(
        (notification) => !notification.isRead
      );

      return {
        read: readNotifications,
        unread: unreadNotifications,
        all: notifications,
      };
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return null;
    }
  };

export const makeAllRead = async (userId: string) => {
  await db.notification.updateMany({
    where: { userId: userId },
    data: {
      isRead: true,
    },
  });
};

// API Token
// Please copy your new API token. For your security, it won't be shown again.
// ZXompJhIQrIAAuJKsxZv5F1K8NP8QxpVBHF0gy9k2ab889a5

// ZXompJhIQrIAAuJKsxZv5F1K8NP8QxpVBHF0gy9k2ab889a5;

export const getAllProjects = async () => {
  // const allProjects = (await db.project.findMany({
  //   select: {
  //     id: true,
  //     title: true,
  //     status: true,
  //     plagiarismScore: true,
  //     description: true,
  //     updatedAt: true,
  //   },
  // })) as ProjectType[]; // Cast the result to ProjectType[]
  const allProjects = await db.project.findMany({
    include: {
      student: {
        select: {
          id: true,
          fullName: true,
          imageUrl: true,
        },
      },
      supervisor: {
        select: {
          id: true,
          fullName: true,
          imageUrl: true,
        },
      },
    },
  });

  return allProjects;
};

export const setApproved = async (id: string, feedback?: string) => {
  const updatedProject = await db.project.update({
    where: { id },
    data: {
      status: ProjectStatus.APPROVED,
      feedback: feedback || "No feedback",
    },
    include: {
      student: {
        select: {
          id: true,
          fullName: true,
          imageUrl: true,
        },
      },
      supervisor: {
        select: {
          id: true,
          fullName: true,
          imageUrl: true,
        },
      },
    },
  });

  return updatedProject;
};

export const setRejected = async (id: string, feedback?: string) => {
  const updatedProject = await db.project.update({
    where: { id },
    data: {
      status: ProjectStatus.REJECTED,
      feedback: feedback || "No feedback",
    },
    include: {
      student: {
        select: {
          id: true,
          fullName: true,
          imageUrl: true,
        },
      },
      supervisor: {
        select: {
          id: true,
          fullName: true,
          imageUrl: true,
        },
      },
    },
  });

  return updatedProject;
};

export const setUnderReview = async (id: string, feedback?: string) => {
  const updatedProject = await db.project.update({
    where: { id },
    data: {
      status: ProjectStatus.UNDER_REVIEW,
      feedback: feedback || "No feedback", // Optional feedback field
    },
    include: {
      student: {
        select: {
          id: true,
          fullName: true,
          imageUrl: true,
        },
      },
      supervisor: {
        select: {
          id: true,
          fullName: true,
          imageUrl: true,
        },
      },
    },
  });

  return updatedProject;
};

export const getProject = async (id: string) => {
  try {
    const project = await db.project.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            imageUrl: true,
          },
        },
        supervisor: {
          select: {
            id: true,
            imageUrl: true,
            fullName: true,
          },
        },
      },
    });

    if (project) {
      // Parse the plagiarismReport string into an array of objects
      const parsedProject = {
        ...project,
        plagiarismReport: JSON.parse(project.plagiarismReport || "[]"),
      };

      return parsedProject;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAllStudentProjects = async (id: string) => {
  try {
    const projects = await db.user.findUnique({
      where: { id },
      select: {
        projects: {
          include: {
            student: {
              select: {
                id: true,
                fullName: true,
                imageUrl: true,
              },
            },
            supervisor: {
              select: {
                id: true,
                imageUrl: true,
                fullName: true,
              },
            },
          },
        },
      },
    });

    return projects;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// export const updateUserRole = async (id: string, role: Role) => {
//   const user = await db.user.update({
//     where: { id },
//     data: {
//       role: role,
//     },
//   });

//   return user;
// };

import { clerkClient } from "@clerk/nextjs/server";

export const updateUserRole = async (id: string, role: Role) => {
  // Update role in your database
  const user = await db.user.update({
    where: { id },
    data: { role },
  });

  // Update Clerk metadata
  try {
    const clerkClientInstance = await clerkClient();
    await clerkClientInstance.users.updateUser(id, {
      publicMetadata: { role },
    });
  } catch (error) {
    console.error("Failed to update Clerk metadata:", error);
  }

  return user;
};

// teacher daasboard stats

// Fetch the number of pending reviews
export const getPendingReviews = async () => {
  try {
    const authUser = await currentUser();
    if (!authUser) return { data: null, status: 404 };

    const pendingReviews = await db.project.count({
      where: {
        supervisor: {
          clerkId: authUser.id,
        },
        status: ProjectStatus.PENDING,
      },
    });

    return { data: pendingReviews, status: 200 };
  } catch (error) {
    console.log(error);
    return { data: null, status: 500 };
  }
};

// Fetch the number of projects reviewed this week
export const getReviewedThisWeek = async () => {
  try {
    const authUser = await currentUser();
    if (!authUser) return { data: null, status: 404 };

    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const reviewedThisWeek = await db.project.count({
      where: {
        supervisor: {
          clerkId: authUser.id,
        },
        OR: [
          {
            status: ProjectStatus.APPROVED,
          },
          {
            status: ProjectStatus.REJECTED,
          },
        ],

        updatedAt: {
          gte: startOfWeek,
        },
      },
    });

    return { data: reviewedThisWeek, status: 200 };
  } catch (error) {
    console.log(error);
    return { data: null, status: 500 };
  }
};

// Fetch the number of plagiarism alerts
export const getPlagiarismAlerts = async () => {
  try {
    const authUser = await currentUser();
    if (!authUser) return { data: null, status: 404 };

    const plagiarismAlerts = await db.project.count({
      where: {
        supervisor: {
          clerkId: authUser.id,
        },
        plagiarismScore: {
          gt: 50,
        },
      },
    });

    return { data: plagiarismAlerts, status: 200 };
  } catch (error) {
    console.log(error);
    return { data: null, status: 500 };
  }
};

// Fetch the average score of all projects
export const getAverageScore = async () => {
  try {
    const authUser = await currentUser();
    if (!authUser) return { data: null, status: 404 };

    const averageScore = await db.project.aggregate({
      where: {
        supervisor: {
          clerkId: authUser.id,
        },
      },
      _avg: {
        plagiarismScore: true,
      },
    });

    return { data: averageScore._avg.plagiarismScore || 0, status: 200 };
  } catch (error) {
    console.log(error);
    return { data: null, status: 500 };
  }
};

// Fetch recent notifications for the current user
export const getRecentNotifications = async () => {
  try {
    const authUser = await currentUser();
    if (!authUser) return { data: null, status: 404 };

    const recentNotifications = await db.notification.findMany({
      where: {
        user: {
          clerkId: authUser.id,
        },
      },
      orderBy: {
        createdAt: "desc", // Order by most recent first
      },
      take: 5, // Limit to the last 5 notifications
      include: {
        project: {
          select: {
            title: true, // Include project title if the notification is linked to a project
          },
        },
      },
    });

    return { data: recentNotifications, status: 200 };
  } catch (error) {
    console.error("Error fetching recent notifications:", error);
    return { data: null, status: 500 };
  }
};

export const getUser = async (userId: string) => {
  try {
    const userData = await db.user.findUnique({
      where: { id: userId },
    });

    return userData;
  } catch (error) {
    console.log(error);
  }
};

export const getAllUsers = async () => {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        imageUrl: true,
      },
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const sendMessageAction = async (
  senderId: string,
  receiverId: string,
  content: string
) => {
  try {
    const newMessage = await db.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
    });
    return { status: 200, data: newMessage };
  } catch (error) {
    console.error("Error sending message:", error);
    return { status: 500, data: null };
  }
};

export const getMessages = async (receiverId: string) => {
  try {
    const authUser = await currentUser();
    if (!authUser) return { status: 404, data: null };

    // Fetch messages where sender is authUser and receiver is selectedUser
    const messages = await db.message.findMany({
      where: {
        OR: [
          {
            sender: { clerkId: authUser.id },
            receiver: { id: receiverId },
          },
          {
            sender: { id: receiverId },
            receiver: { clerkId: authUser.id },
          },
        ],
      },
      select: {
        id: true,
        content: true,
        senderId: true,
        receiverId: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            imageUrl: true,
          },
        },
        receiver: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Format the messages to match the desired structure
    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      createdAt: msg.createdAt.toISOString(),
      sender: {
        id: msg.sender.id,
        email: msg.sender.email,
        fullName: msg.sender.fullName,
        role: msg.sender.role,
        imageUrl: msg.sender.imageUrl,
      },
      receiver: {
        id: msg.receiver.id,
        email: msg.receiver.email,
        fullName: msg.receiver.fullName,
        role: msg.receiver.role,
        imageUrl: msg.receiver.imageUrl,
      },
    }));

    return { status: 200, data: formattedMessages };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { status: 500, data: null };
  }
};

export const getSubmissionsCount = async () => {
  try {
    const authUser = await currentUser();
    if (!authUser) return { data: null, status: 404 };

    const submissions = await db.project.count({
      where: {
        student: {
          clerkId: authUser.id,
        },
      },
    });

    return { data: submissions, status: 200 };
  } catch (error) {
    console.log(error);
    return { data: null, status: 500 };
  }
};

export const getApprovalRate = async () => {
  try {
    const authUser = await currentUser();
    if (!authUser) return { data: null, status: 404 };

    // Total submissions
    const totalSubmissions = await db.project.count({
      where: {
        student: {
          clerkId: authUser.id,
        },
      },
    });

    // Approved submissions
    const approvedSubmissions = await db.project.count({
      where: {
        student: {
          clerkId: authUser.id,
        },
        status: "APPROVED",
      },
    });

    // Calculate approval rate
    const approvalRate =
      totalSubmissions > 0 ? (approvedSubmissions / totalSubmissions) * 100 : 0;

    return { data: approvalRate, status: 200 };
  } catch (error) {
    console.log(error);
    return { data: null, status: 500 };
  }
};

export const getPendingReviewsStudent = async () => {
  try {
    const authUser = await currentUser();
    if (!authUser) return { data: null, status: 404 };

    const pendingReviews = await db.project.count({
      where: {
        student: {
          clerkId: authUser.id,
        },
        status: "UNDER_REVIEW",
      },
    });

    return { data: pendingReviews, status: 200 };
  } catch (error) {
    console.log(error);
    return { data: null, status: 500 };
  }
};

export const deleteMessageAction = async (messageId: string) => {
  try {
    // Delete the message from the database
    await db.message.delete({
      where: { id: messageId },
    });

    return { status: 200, message: "Message deleted successfully" };
  } catch (error) {
    console.error("Error deleting message:", error);
    return { status: 500, message: "Failed to delete message" };
  }
};
