<template>
  <div class="container">
    <h1 style="font-size: 40px">About</h1>
    <div class="about">
      <p class="about-content">
        RPI TV is RPI's student-run, volunteer television club.
        We film various campus events and sports in an effort to
        preserve campus culture through video. Full videos of all
        the events we film can be watched for free on our <a href="https://www.youtube.com/@rpi-tv" target="_blank">youtube channel</a>.
      </p>
      <div class="about-content">
        <iframe src="https://www.youtube.com/embed/MfzmM3EFqIY?si=Q0ovRqJmr46-NN7z" allowfullscreen class="video-player" />
      </div>
    </div>
    <div class="team mt-10">
      <h1>Our Team</h1>
      <div v-if="queryData.loading.value" class="loading mb-10">
        <v-progress-circular color="red-darken-1" size="80" indeterminate>
        </v-progress-circular>
        <p style="color: white; text-align: center">Loading Members...</p>
      </div>
      <div v-else class="membership">
        <h2 v-if="officers.length" class="ml-5">Leadership</h2>
          <div class="members mt-2 ml-5">
            <div v-for="officer in officers" :key="officer.id">
              <RouterLink class="member-container" :to="personURL + officer.personId">
                <v-avatar :rounded="officer.person?.profilePicture?.path ? 'default' : 0" size="150"
                          :image="officer.person?.profilePicture?.path ?? rpitvLogo" />
                <p>{{ officer.person?.name }}</p>
                <p class="role">{{ officer.role?.name }}</p>
              </RouterLink>
            </div>
          </div>
        <h2 v-if="members.length" class="ml-5">Members</h2>
        <div class="members mt-2 ml-5">
          <div v-for="member in members" :key="member.id">
            <RouterLink class="member-container" :to="personURL + member.personId">
              <v-avatar :rounded="member.person?.profilePicture?.path ? 'default' : 0" size="150"
                        :image="member.person?.profilePicture?.path ?? rpitvLogo" />
              <p>{{ member.person?.name }}</p>
              <p class="role">{{ member.role?.name }}</p>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FindPersonRolesDocument } from "@/graphql/types";
import type { PersonRole } from "@/graphql/types";
import { useQuery } from "@vue/apollo-composable";
import { ref } from "vue";
import rpitvLogo from "../assets/rpitv_logo.svg";

const personURL =  import.meta.env.BASE_URL + "person/";

const peopleRoles = ref<PersonRole[]>([]);
const officers = ref<PersonRole[]>([]);
const members = ref<PersonRole[]>([]);

const queryData = useQuery(FindPersonRolesDocument, {
  filter: {
    startTime: {
      lt: new Date().toISOString(),
    },
    OR: [
      {
        endTime: {
          gt: new Date().toISOString()
        }
      },
      {
        endTime: null
      }
    ],
  },
  pagination: {
    take: 70
  }
});

queryData.onResult((result) => {
  if (result.loading) return;
  peopleRoles.value = result.data.personRoles;
  officers.value = peopleRoles.value.filter((personRole) => personRole.role?.displayInLeadership);
  officers.value.sort((a, b) =>{
    if ((b.role?.priority as number) - (a.role?.priority as number) !== 0) {
      return (b.role?.priority as number) - (a.role?.priority as number)
    }
    return b.role?.name!.toUpperCase() as string > (a.role?.name!.toUpperCase() as string) ? -1 : 1
  });
  members.value = peopleRoles.value.filter((personRole) => !personRole.role?.displayInLeadership && personRole.role?.displayInMembership);
  members.value = members.value.filter((member) => !officers.value.find((officer) => officer.personId === member.personId));
  members.value.sort((a, b) => {
    if ((b.role?.priority as number) - (a.role?.priority as number) !== 0) {
      return (b.role?.priority as number) - (a.role?.priority as number)
    }
    return b.role?.name!.toUpperCase() as string > (a.role?.name!.toUpperCase() as string) ? -1 : 1
  });
});

</script>

<style scoped lang="scss">
.about {
  display: flex;
  justify-content: space-between;
  @media (max-width: 1000px) {
    flex-wrap: wrap;
  }
}

.about-content {
  width: 47%;
  @media (max-width: 1000px) {
    width: 100%;
    margin-bottom: 25px;
  }
  font-weight: lighter;
  font-size: 24px;
}

.video-player {
  aspect-ratio: 16 / 9;
  width: 100%;
  border: 0;
}

.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

p {
  font-size: 20px;
  font-weight: lighter;
}

a {
  font-weight: lighter;
}

.members {
  width: 100%;
  display: grid;
  grid-auto-rows: 250px;
  grid-template-columns: repeat(auto-fit, 200px);
}
.member-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  text-decoration: inherit;
  color: inherit;
}
.role {
  color: #ff8697;
  font-size: 16px;
  text-align: center;
}
</style>
