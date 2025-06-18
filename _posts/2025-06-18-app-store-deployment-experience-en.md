---
layout: post
title: "Experiences of an App Store Deployment Manager - From Expedited Review to Scheduled Deployment"
date: 2025-06-18 12:00:00 +0900
categories: iOS
tags:
  - iOS
  - App Store
  - Deployment
  - App Store Connect
lang: en
translation_id: app-store-deployment-experience
---

## Introduction

I recently took on the role of App Store deployment manager. While I had mostly handled regular releases before without any special issues, this time I learned a lot through multiple deployment cycles.

This deployment was particularly special. We needed to deploy features after a specific date, with x.x.0 version pre-deployed and x.x.1 version to be deployed with updated screenshots and app descriptions.

I wanted to start deployment on Sunday morning and submitted for review on Friday afternoon, so it wasn't a relaxed situation. That's why I requested an expedited review.

However, unexpected problems occurred continuously. The first submission was rejected due to screenshot regulation violations, I accidentally cancelled an approved build, and scheduled deployment didn't work properly.

In this post, I'll organize the actual problems I encountered, solutions, and lessons learned according to the deployment process flow.

## Pre-Submission Preparation Process

### First Rejection Due to Screenshot Regulation Violation

The first problem I encountered was screenshot regulations. I received screenshots from the designer but **didn't know that price information couldn't be included**.

The word "Free" was included in the screenshot image, which caused the review to be rejected. After removing the price information, the review passed.

Interestingly, **price information can be included in app descriptions**. It's strange that the regulations for screenshots and app descriptions are different.

### Special Character Usage Restrictions

When I tried to include `<` characters typed from the keyboard in the app description, I got an error saying **"contains words that cannot be used"**.

To solve this problem, I found and used special characters similar to `<`:

- `〈` (U+2329) - left-pointing angle bracket
- `〉` (U+232A) - right-pointing angle bracket

They looked properly displayed to the eye, and it seems to be a policy restriction of App Store Connect.

### Strategy for Screenshot Updates

There was a situation where I needed to quickly change screenshots to reflect business content. However, it was impossible to change only screenshots and app descriptions without updating the app version.

Following a colleague's advice, I used the **strategy of preparing the next build in advance** for screenshot updates. I created a build with only the version changed from the same implementation, and requested a review with updated screenshots and descriptions immediately after the previous version's review was completed.

This method made rapid screenshot updates possible.

## Expedited Review

After updating screenshots and app descriptions, I requested an expedited review. I had only seen others do it before, but this was my first time requesting it directly. It seems like in the past you could write a message explaining why expedited review was needed, but now that input field is gone.

Currently, on the [Apple Developer Contact](https://developer.apple.com/contact/) page, you just need to enter App Name and Platform in **App Review > Request Expedited App Review > App Review Inquiry > App Information**.

Initially, the review was rejected due to regulation violations in screenshots and app descriptions, but when I resubmitted after fixing them, they were approved within 1-2 hours. I could directly feel the effect of expedited review.

I'm embarrassed to share this, but I accidentally cancelled an approved expedited review. The submission was cancelled due to a mistake while running an automation script... I was sweating and very surprised at the moment. Fortunately, when I resubmitted, it was approved within 1 hour.

## Misunderstandings About Scheduled Deployment and Gradual Rollout

### Instability of Scheduled Deployment

There was a situation where release was needed at 6 AM, so I tried using scheduled deployment. It was set exactly with local date and time in App Store Connect, but strangely it didn't work properly.

It remained in **"Pending Release"** status. After waiting about 20 minutes with no change, I finally changed it to **"Manually Release Version"** and started the release directly.

The scheduled deployment feature seems convenient but sometimes unstable. I haven't tried it many times, so I plan to try it again later in personal projects.

### Misunderstanding About Gradual Rollout

I was completely wrong about gradual rollout. Initially, I thought it would be shown to users gradually on the App Store, like A/B testing.

Actually, it's **immediately visible to all users on the App Store**, and the **gradual rollout feature only applies to users who allow automatic updates**.

This was a big misunderstanding because I didn't properly understand this point.

## Precautions Discovered During Resubmission Process

### Precautions When Cancelling In-App Events

I discovered something to be careful about when cancelling app review submissions. A specific marketing event was registered as an in-app event, and when I cancelled the app review submission, the **in-app event was also cancelled**.

When cancelling a release, it's good to check if there were in-app events in the review target, and if there were, notify the marketing team in advance.

### Apple Review Speed Improvement

Even without expedited review, **it was possible to go from review registration to deployment within 24 hours**. I had heard that Apple's review speed had improved compared to before, and I could actually feel it.

There could be various factors like app category, review complexity, etc., but overall the review speed seems to have improved.

## Lessons as a Deployment Manager

It was an important deployment, so I was worried and felt a lot of pressure. Still, I learned a lot through this deployment process. I especially realized the **importance of advance preparation** through direct experience with App Store's complex policies and unexpected restrictions.

Key lessons learned:

- **Screenshot Regulations**: Price information prohibited, different from app description regulations
- **Expedited Review**: No message input field, separate request through Apple Developer Contact
- **Screenshot Updates**: New version required, prepare build in advance strategy
- **Special Character Restrictions**: Can be replaced with Unicode special characters
- **Scheduled Deployment**: Unstable in this experience
- **Gradual Rollout**: Unrelated to App Store exposure, only applies to automatic update users
- **In-App Events**: Cancelled together when review is cancelled, advance consultation needed

It suddenly occurred to me that it would be nice to have a service that checks in advance whether there's anything that would violate App Store regulations.

## Conclusion

I think App Store deployment is not just uploading builds and waiting for review, but a complex process that requires understanding and responding to various policies and restrictions. This time too, I learned a lot with the help of team members. While experiencing issues, I used to think I was unlucky, but these days I've strangely become more positive, so I feel good about accumulating good experiences and memories. Anyway, I have hope that I'll be more skilled in the next deployment.

---

**References**
- [Apple Developer Contact](https://developer.apple.com/contact/)
- [Unicode Character Database - U+2329](https://graphemica.com/%E2%8C%A9)
- [Unicode Character Database - U+232A](https://graphemica.com/%E2%8C%AA) 