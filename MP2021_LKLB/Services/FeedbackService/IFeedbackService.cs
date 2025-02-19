﻿using MP2021_LKLB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MP2021_LKLB.Services.FeedbackService
{
    public interface IFeedbackService
    {
        Task<ICollection<FeedbackUser>> GetAllReviews();
        Task<FeedbackUser> Create(FeedbackUser input);
    }
}
